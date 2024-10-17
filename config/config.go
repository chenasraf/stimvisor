package config

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

type Config struct {
	WindowWidth  int `json:"windowWidth"`
	WindowHeight int `json:"windowHeight"`
}

func (c *Config) Save() {
	configDir := GetConfigDir()
	configPath := GetConfigPath()

	os.MkdirAll(configDir, os.ModePerm)
	f, err := os.Create(configPath)
	if err != nil {
		panic(err)
	}
	defer f.Close()
	json, err := json.Marshal(c)
	if err != nil {
		panic(err)
	}
	f.WriteString(string(json))
	fmt.Printf("Config saved in: %s\n", configPath)
}

func NewConfig() *Config {
	return &Config{
		WindowWidth:  1024,
		WindowHeight: 768,
	}
}

func GetConfigDir() string {
	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	return filepath.Join(home, ".stimvisor")
}

func GetConfigPath() string {
	configDir := GetConfigDir()
	configPath := filepath.Join(configDir, "config.json")
	return configPath
}

func GetConfig() Config {
	configPath := GetConfigPath()
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		fmt.Printf("Config file not found: %s\n", configPath)
		fmt.Println("Creating new config file")
		config := NewConfig()
		config.Save()
		return *config
	}

	config := NewConfig()
	configFile, err := os.ReadFile(configPath)

	if err != nil {
		panic(err)
	}

	err = json.Unmarshal([]byte(configFile), config)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Config loaded from: %s\n", configPath)

	return *config
}

func (c *Config) GetWindowSize() (int, int) {
	config := GetConfig()
	return config.WindowWidth, config.WindowHeight
}
