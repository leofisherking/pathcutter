package handler

import (
	"crypto/sha256"
	"encoding/binary"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

const (
	codeLength = 6
	alphabet   = "0123456789abcdefghijklmnopqrstuvwxyz"
)

type Handler struct {
	rdb *redis.Client
}

func NewHandler(rdb *redis.Client) *Handler {
	return &Handler{rdb: rdb}
}

type shortenRequest struct {
	Url string `json:"url" binding:"required,url"`
}

type shortenResponse struct {
	Code string `json:"code"`
}

type errorResponse struct {
	Error string `json:"error"`
}

func generateShortCode(long string) string {
	hash := sha256.Sum256([]byte(long))
	num := binary.BigEndian.Uint64(hash[:8])
	short := make([]byte, codeLength)

	for i := codeLength - 1; i >= 0; i-- {
		short[i] = alphabet[num%36]
		num /= 36
	}

	return string(short)
}

// Shorten godoc
// @Summary      Create short URL
// @Description  Generates a short code for the provided URL and stores it in Redis
// @Tags         url
// @Accept       json
// @Produce      json
// @Param        request  body      shortenRequest  true  "URL to shorten"
// @Success      200      {object}  shortenResponse
// @Failure      400      {object}  errorResponse
// @Failure      409      {object}  errorResponse
// @Failure      500      {object}  errorResponse
// @Router       /shorten [post]
func (h *Handler) Shorten(c *gin.Context) {
	var req shortenRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{Error: err.Error()})
		return
	}

	code := generateShortCode(req.Url)
	ctx := c.Request.Context()

	_, err := h.rdb.SetArgs(ctx, code, req.Url, redis.SetArgs{
		Mode: "NX",
		TTL:  0,
	}).Result()

	if err != nil {
		if errors.Is(err, redis.Nil) {
			c.JSON(http.StatusOK, shortenResponse{Code: code})
			return
		}

		c.JSON(http.StatusInternalServerError, errorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, shortenResponse{Code: code})
}

// Redirect godoc
// @Summary      Redirect to original URL
// @Description  Redirects user to the original URL by short code
// @Tags         url
// @Produce      json
// @Param        code   path      string  true  "Short code"
// @Success      301
// @Failure      404    {object}  errorResponse
// @Failure      500    {object}  errorResponse
// @Router       /{code} [get]
func (h *Handler) Redirect(c *gin.Context) {
	code := c.Param("code")

	longURL, err := h.rdb.Get(c.Request.Context(), code).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			c.JSON(http.StatusNotFound, errorResponse{Error: "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, errorResponse{Error: err.Error()})
		return
	}

	c.Redirect(http.StatusMovedPermanently, longURL)
}
