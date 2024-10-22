package config

import (
	"encoding/json"
	"os"
	"path/filepath"

	"github.com/chenasraf/stimvisor/common"
	"github.com/chenasraf/stimvisor/logger"
)

type Config struct {
	WindowWidth  int `json:"windowWidth"`
	WindowHeight int `json:"windowHeight"`
}

func (c *Config) Save() {
	configDir := common.GetConfigDir()
	configPath := GetConfigPath()

	os.MkdirAll(configDir, os.ModePerm)
	f, err := os.Create(configPath)
	if err != nil {
		logger.FatalErr(err)
		panic(err)
	}
	defer f.Close()
	json, err := json.Marshal(c)
	if err != nil {
		logger.FatalErr(err)
		panic(err)
	}
	f.WriteString(string(json))
	logger.Info("Config saved in: %s", configPath)
}

func NewConfig() *Config {
	return &Config{
		WindowWidth:  1024,
		WindowHeight: 768,
	}
}

func GetConfigPath() string {
	configDir := common.GetConfigDir()
	configPath := filepath.Join(configDir, "config.json")
	return configPath
}

func GetConfig() Config {
	configPath := GetConfigPath()
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		logger.Warn("Config file not found: %s", configPath)
		logger.Info("Creating new config file")
		config := NewConfig()
		config.Save()
		return *config
	}

	config := NewConfig()
	configFile, err := os.ReadFile(configPath)

	if err != nil {
		logger.FatalErr(err)
		panic(err)
	}

	err = json.Unmarshal([]byte(configFile), config)
	if err != nil {
		logger.FatalErr(err)
		panic(err)
	}
	logger.Info("Config loaded from: %s", configPath)

	return *config
}

func (c *Config) GetWindowSize() (int, int) {
	config := GetConfig()
	return config.WindowWidth, config.WindowHeight
}
