package config

import (
	"os"
	"strconv"
)

type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
	PoolSize int
	MinIdle  int
}

type AppConfig struct {
	Redis   RedisConfig
	AppEnv  string
	AppPort string
}

func LoadConfig() AppConfig {
	db, err := strconv.Atoi(os.Getenv("REDIS_DB"))
	if err != nil {
		db = 0
	}

	poolSize, err := strconv.Atoi(os.Getenv("REDIS_POOL_SIZE"))
	if err != nil {
		poolSize = 10
	}

	minIdle, err := strconv.Atoi(os.Getenv("REDIS_MIN_IDLE"))
	if err != nil {
		minIdle = 3
	}

	appPort := os.Getenv("APP_PORT")
	if appPort == "" {
		appPort = "8080"
	}

	appEnv := os.Getenv("APP_ENV")
	if appEnv == "" {
		appEnv = "dev"
	}

	return AppConfig{
		Redis: RedisConfig{
			Host:     os.Getenv("REDIS_HOST"),
			Port:     os.Getenv("REDIS_PORT"),
			Password: os.Getenv("REDIS_PASSWORD"),
			DB:       db,
			PoolSize: poolSize,
			MinIdle:  minIdle,
		},
		AppEnv:  appEnv,
		AppPort: appPort,
	}
}
