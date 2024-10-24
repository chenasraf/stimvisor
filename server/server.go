package server

import (
	"net/http"
	"os"
	"os/signal"
	"path/filepath"

	"github.com/chenasraf/stimvisor/dirs"
	"github.com/chenasraf/stimvisor/logger"
	"github.com/wailsapp/mimetype"
)

func StartServer() InternalServer {
	router := http.NewServeMux()
	router.Handle("/images/", http.StripPrefix("/images/", imageHandler{}))

	server := InternalServer{}
	// TODO use env, and retry other ports when needed
	server.Server = &http.Server{Addr: ":9876", Handler: router}

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, os.Kill)

	server.Server.RegisterOnShutdown(func() {
		logger.Info("OnShutdown")
		stop <- os.Interrupt
	})

	go runImageServer(server.Server)

	return server
}

type InternalServer struct {
	Server *http.Server
	Stop   chan os.Signal
}

type imageHandler struct{}

func (h imageHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	logger.Info("Request: %s", r.URL.Path)
	path := r.URL.Path
	if path == "" {
		http.Error(w, "No path specified", http.StatusBadRequest)
		return
	}
	basedir, err := dirs.GetSteamUserDirectory()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fullPath := filepath.Join(basedir, path)
	bytes, err := os.ReadFile(fullPath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	mimeType := mimetype.Detect(bytes)
	switch mimeType.String() {
	case "image/png", "image/jpeg", "image/gif", "image/webp":
		logger.Debug("Serving image: %s (%s)", fullPath, mimeType.String())
		http.ServeFile(w, r, fullPath)
	default:
		logger.Error("Unsupported mime type: %s", mimeType.String())
		http.Error(w, "Unsupported image type", http.StatusBadRequest)
	}
}

func runImageServer(server *http.Server) {
	err := server.ListenAndServe()
	if err != nil {
		if err.Error() != "http: Server closed" {
			panic(err)
		}
	}
}
