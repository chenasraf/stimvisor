package native

import (
	"fmt"
	"os/exec"
	"runtime"
)

func NativeOpen(path string) error {
	switch runtime.GOOS {
	case "windows":
		return exec.Command("cmd", "/c", "start", path).Start()
	case "darwin":
		return exec.Command("open", path).Start()
	case "linux":
		return exec.Command("xdg-open", path).Start()
	default:
		return fmt.Errorf("Unsupported platform: %s", runtime.GOOS)
	}
}
