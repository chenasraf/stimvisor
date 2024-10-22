package logger

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/chenasraf/stimvisor/common"
	"github.com/davecgh/go-spew/spew"
)

var (
	LOGFILE *os.File // file writer log.txt
	titles  map[LogLevel]string
	colors  map[LogLevel]string
)

type LogLevel int

const (
	DEBUG LogLevel = iota
	INFO
	WARN
	ERROR
	FATAL
)

func log(level LogLevel, format string, args ...interface{}) {
	timestamp := strings.Replace(time.Now().Format(time.RFC3339), "T", " ", 1)
	fileFmt := fmt.Sprintf("%s [%s] %s\n", timestamp, titles[level], format)
	spew.Fprintf(LOGFILE, fileFmt, args...)

	stdoutFmt := fmt.Sprintf("[%s] %s%s%s\n", titles[level], colors[level], format, "\033[0m")
	fmt.Printf(stdoutFmt, args...)
}

func Info(format string, args ...interface{}) {
	log(INFO, format, args...)
}

func Debug(format string, args ...interface{}) {
	log(DEBUG, format, args...)
}

func Warn(format string, args ...interface{}) {
	log(WARN, format, args...)
}

func Error(format string, args ...interface{}) {
	log(ERROR, format, args...)
}

func Fatal(format string, args ...interface{}) {
	log(FATAL, format, args...)
}

func FatalErr(err error) {
	Fatal("Error: %s", err)
}

func ErrorErr(err error) {
	Error("Error: %s", err)
}

func Init() {
	config := common.GetConfigDir()
	f, err := os.OpenFile(filepath.Join(config, "stimvisor.log"), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Println("[FATAL] Error creating log file", err)
		panic(err)
	}
	LOGFILE = f

	titles = make(map[LogLevel]string)
	titles[DEBUG] = "DEBUG"
	titles[INFO] = "INFO"
	titles[WARN] = "WARN"
	titles[ERROR] = "ERROR"
	titles[FATAL] = "FATAL"

	// colorDefault := "\033[0m"
	colorCyan := "\033[36m"
	colorDim := "\033[2m"
	colorRed := "\033[31m"
	colorYellow := "\033[33m"

	colors = make(map[LogLevel]string)
	colors[DEBUG] = colorDim
	colors[INFO] = colorCyan
	colors[WARN] = colorYellow
	colors[ERROR] = colorRed
	colors[FATAL] = colorRed
}
