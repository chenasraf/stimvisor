package common

import (
	"os"
	"path/filepath"
)

func GetConfigDir() string {
	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	return filepath.Join(home, ".stimvisor")
}
