FROM golang:1.26-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o pathcutter ./cmd/main.go

FROM alpine:3.18

WORKDIR /app

COPY --from=builder /app/pathcutter .

COPY --from=builder /app/docs ./docs

RUN apk add --no-cache ca-certificates tzdata

ENV GIN_MODE=release

EXPOSE 8080

CMD ["./pathcutter"]