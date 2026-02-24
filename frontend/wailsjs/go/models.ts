export namespace main {
	
	export class BaseResult {
	    decimal: string;
	    hex: string;
	    binary: string;
	    octal: string;
	
	    static createFrom(source: any = {}) {
	        return new BaseResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.decimal = source["decimal"];
	        this.hex = source["hex"];
	        this.binary = source["binary"];
	        this.octal = source["octal"];
	    }
	}
	export class ColorResult {
	    hex: string;
	    rgb: string;
	    hsl: string;
	    rgba: string;
	
	    static createFrom(source: any = {}) {
	        return new ColorResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hex = source["hex"];
	        this.rgb = source["rgb"];
	        this.hsl = source["hsl"];
	        this.rgba = source["rgba"];
	    }
	}
	export class DiffLine {
	    type: string;
	    content: string;
	    lineNum: number;
	
	    static createFrom(source: any = {}) {
	        return new DiffLine(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.content = source["content"];
	        this.lineNum = source["lineNum"];
	    }
	}
	export class JSONResult {
	    output: string;
	    error: string;
	    valid: boolean;
	
	    static createFrom(source: any = {}) {
	        return new JSONResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.output = source["output"];
	        this.error = source["error"];
	        this.valid = source["valid"];
	    }
	}
	export class JWTResult {
	    header: string;
	    payload: string;
	    signature: string;
	    valid: boolean;
	    error: string;
	    algorithm: string;
	    isExpired: boolean;
	    expiresAt: string;
	    issuedAt: string;
	
	    static createFrom(source: any = {}) {
	        return new JWTResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.header = source["header"];
	        this.payload = source["payload"];
	        this.signature = source["signature"];
	        this.valid = source["valid"];
	        this.error = source["error"];
	        this.algorithm = source["algorithm"];
	        this.isExpired = source["isExpired"];
	        this.expiresAt = source["expiresAt"];
	        this.issuedAt = source["issuedAt"];
	    }
	}
	export class PasswordOptions {
	    length: number;
	    uppercase: boolean;
	    lowercase: boolean;
	    numbers: boolean;
	    symbols: boolean;
	    excludeAmbiguous: boolean;
	
	    static createFrom(source: any = {}) {
	        return new PasswordOptions(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.length = source["length"];
	        this.uppercase = source["uppercase"];
	        this.lowercase = source["lowercase"];
	        this.numbers = source["numbers"];
	        this.symbols = source["symbols"];
	        this.excludeAmbiguous = source["excludeAmbiguous"];
	    }
	}
	export class RegexMatch {
	    match: string;
	    index: number;
	    groups: string[];
	
	    static createFrom(source: any = {}) {
	        return new RegexMatch(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.match = source["match"];
	        this.index = source["index"];
	        this.groups = source["groups"];
	    }
	}
	export class RegexResult {
	    matches: RegexMatch[];
	    count: number;
	    error: string;
	    valid: boolean;
	
	    static createFrom(source: any = {}) {
	        return new RegexResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.matches = this.convertValues(source["matches"], RegexMatch);
	        this.count = source["count"];
	        this.error = source["error"];
	        this.valid = source["valid"];
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
	export class TextStats {
	    characters: number;
	    words: number;
	    lines: number;
	    sentences: number;
	    paragraphs: number;
	    uniqueWords: number;
	
	    static createFrom(source: any = {}) {
	        return new TextStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.characters = source["characters"];
	        this.words = source["words"];
	        this.lines = source["lines"];
	        this.sentences = source["sentences"];
	        this.paragraphs = source["paragraphs"];
	        this.uniqueWords = source["uniqueWords"];
	    }
	}
	export class TimeResult {
	    utc: string;
	    unix: number;
	    unixMilli: number;
	    iso8601: string;
	    rfc822: string;
	    relative: string;
	
	    static createFrom(source: any = {}) {
	        return new TimeResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.utc = source["utc"];
	        this.unix = source["unix"];
	        this.unixMilli = source["unixMilli"];
	        this.iso8601 = source["iso8601"];
	        this.rfc822 = source["rfc822"];
	        this.relative = source["relative"];
	    }
	}

}

