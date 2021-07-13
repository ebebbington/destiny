/**
 * Tokenizer results.
 */
 interface LexToken {
    type:
      | "OPEN"
      | "CLOSE"
      | "PATTERN"
      | "NAME"
      | "CHAR"
      | "ESCAPED_CHAR"
      | "MODIFIER"
      | "END";
    index: number;
    value: string;
  }
  
  /**
   * Tokenize input string.
   */
  function lexer(str: string): LexToken[] {
    const tokens: LexToken[] = [];
    let i = 0;
  
    while (i < str.length) {
      const char = str[i];
  
      if (char === "*" || char === "+" || char === "?") {
        tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
        continue;
      }
  
      if (char === "\\") {
        tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
        continue;
      }
  
      if (char === "{") {
        tokens.push({ type: "OPEN", index: i, value: str[i++] });
        continue;
      }
  
      if (char === "}") {
        tokens.push({ type: "CLOSE", index: i, value: str[i++] });
        continue;
      }
  
      if (char === ":") {
        let name = "";
        let j = i + 1;
  
        while (j < str.length) {
          const code = str.charCodeAt(j);
  
          if (
            // `0-9`
            (code >= 48 && code <= 57) ||
            // `A-Z`
            (code >= 65 && code <= 90) ||
            // `a-z`
            (code >= 97 && code <= 122) ||
            // `_`
            code === 95
          ) {
            name += str[j++];
            continue;
          }
  
          break;
        }
  
        if (!name) throw new TypeError(`Missing parameter name at ${i}`);
  
        tokens.push({ type: "NAME", index: i, value: name });
        i = j;
        continue;
      }
  
      if (char === "(") {
        let count = 1;
        let pattern = "";
        let j = i + 1;
  
        if (str[j] === "?") {
          throw new TypeError(`Pattern cannot start with "?" at ${j}`);
        }
  
        while (j < str.length) {
          if (str[j] === "\\") {
            pattern += str[j++] + str[j++];
            continue;
          }
  
          if (str[j] === ")") {
            count--;
            if (count === 0) {
              j++;
              break;
            }
          } else if (str[j] === "(") {
            count++;
            if (str[j + 1] !== "?") {
              throw new TypeError(`Capturing groups are not allowed at ${j}`);
            }
          }
  
          pattern += str[j++];
        }
  
        if (count) throw new TypeError(`Unbalanced pattern at ${i}`);
        if (!pattern) throw new TypeError(`Missing pattern at ${i}`);
  
        tokens.push({ type: "PATTERN", index: i, value: pattern });
        i = j;
        continue;
      }
  
      tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
  
    tokens.push({ type: "END", index: i, value: "" });
  
    return tokens;
  }
  
  /**
   * Escape a regular expression string.
   */
  function escapeString(str: string) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
  }
  
  /**
   * Expose a function for taking tokens and returning a RegExp.
   */
  function tokensToRegexp(
    tokens: Token[],
  ): RegExp {
    let route =  "^";
  
    // Iterate over the tokens and create our regexp string.
    for (const token of tokens) {
      if (typeof token === "string") {
        route += escapeString(token);
      } else {
        const prefix = escapeString(token.prefix);
        const suffix = escapeString(token.suffix);
  
        if (token.pattern) {
          if (prefix || suffix) {
            if (token.modifier === "+" || token.modifier === "*") {
              const mod = token.modifier === "*" ? "?" : "";
              route += `(?:${prefix}((?:${token.pattern})(?:${suffix}${prefix}(?:${token.pattern}))*)${suffix})${mod}`;
            } else {
              route += `(?:${prefix}(${token.pattern})${suffix})${token.modifier}`;
            }
          } else {
            route += `(${token.pattern})${token.modifier}`;
          }
        } else {
          route += `(?:${prefix}${suffix})${token.modifier}`;
        }
      }
    }
  
    route += `[${escapeString("/#?")}]?`;
    route += "$";
    
    return new RegExp(route, "i");
  }
  type Token = string | Key
  interface Key {
    name: string | number;
    prefix: string;
    suffix: string;
    pattern: string;
    modifier: string;
  }
  function parse(str: string): Token[] {
    const tokens = lexer(str);
    const prefixes = "./"
    const defaultPattern = `[^${escapeString("/#?")}]+?`;
    const result: Token[] = [];
    let key = 0;
    let i = 0;
    let path = "";
  
    const tryConsume = (type: LexToken["type"]): string | undefined => {
      if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
    };
  
    const mustConsume = (type: LexToken["type"]): string => {
      const value = tryConsume(type);
      if (value !== undefined) return value;
      const { type: nextType, index } = tokens[i];
      throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}`);
    };
  
    const consumeText = (): string => {
      let result = "";
      let value: string | undefined;
      // tslint:disable-next-line
      while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
        result += value;
      }
      return result;
    };
  
    while (i < tokens.length) {
      const char = tryConsume("CHAR");
      const name = tryConsume("NAME");
      const pattern = tryConsume("PATTERN");
  
      if (name || pattern) {
        let prefix = char || "";
  
        if (prefixes.indexOf(prefix) === -1) {
          path += prefix;
          prefix = "";
        }
  
        if (path) {
          result.push(path);
          path = "";
        }
  
        result.push({
          name: name || key++,
          prefix,
          suffix: "",
          pattern: pattern || defaultPattern,
          modifier: tryConsume("MODIFIER") || ""
        });
        continue;
      }
  
      const value = char || tryConsume("ESCAPED_CHAR");
      if (value) {
        path += value;
        continue;
      }
  
      if (path) {
        result.push(path);
        path = "";
      }
  
      const open = tryConsume("OPEN");
      if (open) {
        const prefix = consumeText();
        const name = tryConsume("NAME") || "";
        const pattern = tryConsume("PATTERN") || "";
        const suffix = consumeText();
  
        mustConsume("CLOSE");
  
        result.push({
          name: name || (pattern ? key++ : ""),
          pattern: name && !pattern ? defaultPattern : pattern,
          prefix,
          suffix,
          modifier: tryConsume("MODIFIER") || ""
        });
        continue;
      }
  
      mustConsume("END");
    }
  
    return result;
  }
  
  /**
   * Create path match function from `path-to-regexp` spec.
   */
  export function match(
    str: string,
  ): (str: string) => false | Record<string, string> {
    const re = tokensToRegexp(parse(str));
    return function(pathname: string) {
      const m = re.exec(pathname);
      if (!m) return false;
      if (m.length > 1) {
        m.shift()
      }
      const paramNames = str
        .split("/")
        .filter(p => p.includes(':'))
        .map(p => p.replace(/(:)/, ""))
        .map(p => p.replace(/(\?)/, ""))
      const k: Record<string, string> = {}
      for (const i in m) {
        k[paramNames[i]] = m[i]
      }
      return k
    };
  }