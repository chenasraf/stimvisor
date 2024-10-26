package main

import (
	"context"
	"path/filepath"

	"github.com/chenasraf/stimvisor/config"
	"github.com/chenasraf/stimvisor/dirs"
	"github.com/chenasraf/stimvisor/logger"
	"github.com/chenasraf/stimvisor/native"
	"github.com/chenasraf/stimvisor/screenshots"
	"github.com/chenasraf/stimvisor/server"
	"github.com/chenasraf/stimvisor/steam"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx    context.Context
	server server.InternalServer
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	logger.Init()
	a.server = server.StartServer()
	a.ctx = ctx
}

func (a *App) shutdown(ctx context.Context) {
	// ctx, cancel := context.WithTimeout(ctx, 1*time.Second)
	// defer cancel()

	logger.Info("Shutting down server")
	if err := a.server.Server.Shutdown(ctx); err != nil {
		logger.Error("Shutdown error: %s", err)
	}

	logger.Info("Server shutdown complete")

	// select {
	// case <-a.server.Stop:
	// 	logger.Info("Server stopped")
	// case <-ctx.Done():
	// 	logger.Warn("Server shutdown timed out")
	// }
}

func LibraryMetaInfo(err error) LibraryInfo {
	return LibraryInfo{Error: err.Error()}
}

type LibraryInfo struct {
	Error    string   `json:"error,omitempty"`
	SteamDir string   `json:"steamDir"`
	UserDir  string   `json:"userDir"`
	GameDirs []string `json:"gameDirs"`
	SyncDir  string   `json:"syncDir"`
}

func (a *App) GetLibraryInfo() LibraryInfo {
	p, err := dirs.GetSteamDirectory()
	if err != nil {
		return LibraryMetaInfo(err)
	}
	userDir, err := dirs.GetSteamUserDirectory()
	if err != nil {
		return LibraryMetaInfo(err)
	}
	// fmt.Printf("User Dir: %s\n", userDir)
	userId := filepath.Base(userDir)
	gd, err := steam.GetAllDirs(userId)
	if err != nil {
		return LibraryMetaInfo(err)
	}
	syncDir, err := dirs.GetSyncDirectory()
	if err != nil {
		return LibraryMetaInfo(err)
	}
	out := LibraryInfo{
		SteamDir: p,
		GameDirs: gd,
		UserDir:  userDir,
		SyncDir:  syncDir,
	}

	return out
}

type ScreenshotCollectionResponse struct {
	Error                 string                             `json:"error,omitempty"`
	ScreenshotCollections []screenshots.ScreenshotCollection `json:"screenshotCollections"`
}

func ScreenshotCollectionError(err error) ScreenshotCollectionResponse {
	logger.Error("Returning error: %s", err)
	return ScreenshotCollectionResponse{Error: err.Error()}
}

const SHORT_SCREENSHOTS_LIMIT = 5

func (a *App) GetScreenshots() ScreenshotCollectionResponse {
	screenshotsDirPaths, err := screenshots.GetAllDirs()
	if err != nil {
		logger.Error("Returning error: %s", err)
		return ScreenshotCollectionError(err)
	}
	screenshotsDirs := []screenshots.ScreenshotCollection{}
	for _, path := range screenshotsDirPaths {
		scr, err := screenshots.NewScreenshotsDirFromPath(path, SHORT_SCREENSHOTS_LIMIT)
		if err != nil || len(scr.Screenshots) == 0 {
			if err != nil {
				logger.Warn("Error fetching screenshots for %s:\n %s", scr.GameId, err)
			}
			continue
		}
		screenshotsDirs = append(screenshotsDirs, scr)
	}
	return ScreenshotCollectionResponse{ScreenshotCollections: screenshotsDirs}
}

func (a *App) GetScreenshotsForGame(gameId string) ScreenshotCollectionResponse {
	screenshotsDirPath, err := screenshots.GetDirForGame(gameId)
	if err != nil {
		logger.Error("Returning error: %s", err)
		return ScreenshotCollectionError(err)
	}
	screenshotsDir, err := screenshots.NewScreenshotsDirFromPath(screenshotsDirPath, 0)
	if err != nil {
		return ScreenshotCollectionError(err)
	}
	return ScreenshotCollectionResponse{ScreenshotCollections: []screenshots.ScreenshotCollection{screenshotsDir}}
}

func (a *App) ManageScreenshot(path []string, action string) error {
	for _, p := range path {
		err := screenshots.ManageScreenshot(p, screenshots.ScreensotAction(action))
		if err != nil {
			return err
		}
	}
	return nil
}

type GamesResponse struct {
	Error string           `json:"error,omitempty"`
	Games []steam.GameInfo `json:"games"`
}

func GamesError(err error) GamesResponse {
	logger.Error("Returning error: %s", err)
	return GamesResponse{Error: err.Error()}
}

func (a *App) GetGames() GamesResponse {
	userId, err := dirs.GetUserId()
	if err != nil {
		logger.Error("Returning error: %s", err)
		return GamesError(err)
	}
	gameDirPaths, err := steam.GetAllDirs(userId)
	if err != nil {
		logger.Error("Returning error: %s", err)
		return GamesError(err)
	}
	games := []steam.GameInfo{}
	for _, path := range gameDirPaths {
		gameId := filepath.Base(path)
		gameInfo, err := steam.GetGameInfo(gameId)
		if err != nil {
			continue
		}
		games = append(games, gameInfo)
	}
	return GamesResponse{Games: games}
}

type GameInfoResponse struct {
	Error string         `json:"error,omitempty"`
	Game  steam.GameInfo `json:"game"`
}

func GameInfoError(err error) GameInfoResponse {
	logger.Error("Returning error: %s", err)
	return GameInfoResponse{Error: err.Error()}
}

func (a *App) GetGameInfo(gameId string) GameInfoResponse {
	gameInfo, err := steam.GetGameInfo(gameId)
	if err != nil {
		logger.Error("Returning error: %s", err)
		return GameInfoError(err)
	}
	return GameInfoResponse{Game: gameInfo}
}

func (a *App) OnWindowResize() {
	config := config.GetConfig()

	w, h := runtime.WindowGetSize(a.ctx)
	// fmt.Printf("OnWindowResize: %d, %d\n", w, h)
	config.WindowWidth = w
	config.WindowHeight = h

	config.Save()
}

func (a *App) NativeOpen(path string) error {
	return native.NativeOpen(path)
}
