package config

import "os"

type Config struct {
	AppPort      string
	DatabaseURL  string
	DemoAuthCode string
	DemoToken    string
}

func Load() Config {
	return Config{
		AppPort:      getenv("APP_PORT", "8080"),
		DatabaseURL:  getenv("DATABASE_URL", "postgres://chef:chef@localhost:5432/chef_table?sslmode=disable"),
		DemoAuthCode: getenv("DEMO_AUTH_CODE", "1234"),
		DemoToken:    getenv("DEMO_TOKEN", "demo-token"),
	}
}

func getenv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}
