import {useState} from "react";
import {Copy, Github} from "lucide-react";
import {toast} from "sonner";
import {Button} from "../components/button";
import {Input} from "../components/input";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;

export default function Home() {
    const [longUrl, setLongUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const generateShortUrl = async () => {
        if (!longUrl.trim()) {
            toast.error("Please enter a URL to shorten");
            return;
        }

        try {
            new URL(longUrl);
        } catch {
            toast.error("Please enter a valid URL (including http:// or https://)");
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post(`${API_URL}/shorten`, {
                url: longUrl,
            });
            const shortCode = response.data.code;
            setShortUrl(`${PUBLIC_URL}/${shortCode}`);
            toast.success("URL shortened successfully!");
        } catch (error: any) {
            console.error(error);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Network error or server is unreachable");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl);
        toast.success("Copied to clipboard!");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            generateShortUrl();
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <div className="absolute top-6 right-6">
                <Button
                    variant="outline"
                    size="icon"
                    className="bg-white border-white hover:bg-gray-200 text-black transition-colors rounded-full"
                    asChild
                >
                    <a
                        href="https://github.com/leofisherking"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        <Github className="h-5 w-5"/>
                    </a>
                </Button>
            </div>

            <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-2xl space-y-8">
                    <h1
                        className="text-center text-2xl md:text-3xl tracking-tight"
                        style={{fontFamily: "'Press Start 2P', cursive"}}
                    >
                        PathCutter
                    </h1>

                    <p
                        className="text-center text-xs text-gray-400"
                        style={{fontFamily: "'Press Start 2P', cursive"}}
                    >
                        Cut your long URLs short
                    </p>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="long-url"
                                className="block text-xs text-gray-300"
                                style={{fontFamily: "'Press Start 2P', cursive"}}
                            >
                                Enter URL
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    id="long-url"
                                    type="text"
                                    placeholder="https://example.com/very/long/url"
                                    value={longUrl}
                                    onChange={(e) => setLongUrl(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-600 focus:border-white"
                                    style={{fontFamily: "'Press Start 2P', cursive", fontSize: '10px'}}
                                />
                                <Button
                                    onClick={generateShortUrl}
                                    disabled={isLoading}
                                    className="bg-white text-black hover:bg-gray-200"
                                    style={{fontFamily: "'Press Start 2P', cursive", fontSize: '10px'}}
                                >
                                    {isLoading ? "..." : "Cut"}
                                </Button>
                            </div>
                        </div>

                        {shortUrl && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                                <label
                                    htmlFor="short-url"
                                    className="block text-xs text-gray-300"
                                    style={{fontFamily: "'Press Start 2P', cursive"}}
                                >
                                    Short URL
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        id="short-url"
                                        type="text"
                                        value={shortUrl}
                                        readOnly
                                        className="flex-1 bg-gray-900 border-green-500 text-green-400 cursor-not-allowed"
                                        style={{fontFamily: "'Press Start 2P', cursive", fontSize: '10px'}}
                                    />
                                    <Button
                                        onClick={copyToClipboard}
                                        variant="outline"
                                        className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
                                        style={{fontFamily: "'Press Start 2P', cursive", fontSize: '10px'}}
                                    >
                                        <Copy className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-6 text-center">
                <p
                    className="text-xs text-gray-600"
                    style={{fontFamily: "'Press Start 2P', cursive"}}
                >
                    PathCutter © 2026
                </p>
            </footer>
        </div>
    );
}