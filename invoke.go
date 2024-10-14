package main

import (
	"encoding/json"
	"fmt"
)

type Invoke struct {
	Command string
}

type InvokeRunnable interface {
	Run(args map[string]interface{})
}

//

type GetScreenshotsDirs struct {
	Command string
}

func (g GetScreenshotsDirs) Run(args map[string]interface{}) {
	p, err := GetSteamDirectory()
	if err != nil {
		fmt.Println(err)
		return
	}
	out := make(map[string]interface{})
	out["steam_dir"] = p

	res, _ := json.Marshal(out)
	fmt.Println(string(res))
}

//

func parseCommand(command string) (InvokeRunnable, error) {
	switch command {
	case "get_screenshots_dirs":
		return GetScreenshotsDirs{}, nil
	}
	return nil, fmt.Errorf("unknown command %q", command)
}
