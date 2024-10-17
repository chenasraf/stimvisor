export namespace dirs {
	
	export class ScreenshotsDir {
	    dir: string;
	    userId: string;
	    gameId: string;
	    screenshots: string[];
	
	    static createFrom(source: any = {}) {
	        return new ScreenshotsDir(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dir = source["dir"];
	        this.userId = source["userId"];
	        this.gameId = source["gameId"];
	        this.screenshots = source["screenshots"];
	    }
	}

}

export namespace main {
	
	export class ScreenshotsDirs {
	    error?: string;
	    screenshotsDirs: dirs.ScreenshotsDir[];
	
	    static createFrom(source: any = {}) {
	        return new ScreenshotsDirs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.error = source["error"];
	        this.screenshotsDirs = this.convertValues(source["screenshotsDirs"], dirs.ScreenshotsDir);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class SteamLibraryMeta {
	    error?: string;
	    steamDir: string;
	    userDir: string;
	    gameDirs: string[];
	    syncDir: string;
	
	    static createFrom(source: any = {}) {
	        return new SteamLibraryMeta(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.error = source["error"];
	        this.steamDir = source["steamDir"];
	        this.userDir = source["userDir"];
	        this.gameDirs = source["gameDirs"];
	        this.syncDir = source["syncDir"];
	    }
	}

}

