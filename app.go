package main

import (
	"context"
	"encoding/json"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func JsonResponse(data interface{}, err error) string {
	if err != nil {
		res, _ := json.Marshal(map[string]interface{}{"error": err.Error()})
		return string(res)
	}
	res, _ := json.Marshal(data)
	return string(res)
}

func (a *App) GetScreenshotsDirs() string {
	p, err := GetSteamDirectory()
	if err != nil {
		return JsonResponse(nil, err)
	}
	out := make(map[string]interface{})
	out["steamDir"] = p

	return JsonResponse(out, nil)
}
