package main

import (
	"context"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/leofisherking/pathcutter/internal/config"
	"github.com/leofisherking/pathcutter/internal/handler"
	"github.com/leofisherking/pathcutter/internal/infrastructure"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "github.com/leofisherking/pathcutter/docs"
)

func main() {
	cfg := config.LoadConfig()
	rdb := infrastructure.NewRedisClient(cfg.Redis)

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatal("redis unavailable:", err)
	}

	h := handler.NewHandler(rdb)

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.POST("/shorten", h.Shorten)
	router.GET("/:code", h.Redirect)

	if cfg.AppEnv != "prod" {
		router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}

	if err := router.Run(":" + cfg.AppPort); err != nil {
		log.Fatal(err)
	}
}
