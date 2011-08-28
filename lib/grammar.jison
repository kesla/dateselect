/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
("year"|"y")              return 'YEAR'
("month"|"M")             return 'MONTH'
("day"|"d")               return 'DAY'
("hour"|"h")              return 'HOUR'
("minute"|"m")            return 'MINUTE'
("second"|"s")            return 'SECOND'
"."[0-9]+                 return 'CLASS'
".week"("day"|"end")      return 'DAYCLASS'
".monday"                 return 'DAYCLASS'
".tuesday"                return 'DAYCLASS'
".wednesday"              return 'DAYCLASS'
".thursday"               return 'DAYCLASS'
".friday"                 return 'DAYCLASS'
".saturday"               return 'DAYCLASS'
".sunday"                 return 'DAYCLASS'
">"                       return '>'
<<EOF>>                   return 'EOF'
.                         return 'INVALID'

/lex

/* operator associations and precedence */

%start expressions

%% /* language grammar */

expressions
    : year EOF
      {
        return this.res;
      }
    ;

dayclass
    : 'DAYCLASS'
      {
        $$ = yytext.slice(1);
      }
    | class
      {$$ = $1}
    ;

class
    : 'CLASS'
      {
        $$ = Number(yytext.slice(1));
      }
    |
      {$$ = -1}
    ;

year
    : 'YEAR' class brmonth month
      {
        this.res = this.res || {};
        this.res.year = $2
      }
    | month
      {}
    ;

brmonth
    : '>' class brday
      {
        this.res = this.res || {};
        this.res.month = $2
      }
    | // do nothing
    ;

month
    : 'MONTH' class brday day
        {
          this.res = this.res || {};
          this.res.month = $2;
        }
    | day
        {}
    ;

brday
    : '>' class brhour
      {
        this.res = this.res || {};
        this.res.day = $2
      }
    | // do nothing
    ;
day
    : 'DAY' dayclass brhour hour
        {
          this.res = this.res || {};
          this.res.day = $2;
        }
    | hour
        {}
    ;
brhour
    : '>' class brminute
      {
        this.res = this.res || {};
        this.res.hour = $2
      }
    | // do nothing
    ;
hour
    : 'HOUR' class brminute minute
        {
          this.res = this.res || {};
          this.res.hour = $2;
        }
    | minute
        {}
    ;
brminute
    : '>' class brsecond
      {
        this.res = this.res || {};
        this.res.minute = $2
      }
    | // do nothing
    ;

minute
    : 'MINUTE' class brsecond second
        {
          this.res = this.res || {};
          this.res.minute = $2;
        }
    | second
        {}
    ;

brsecond
    : '>' class
      {
        this.res = this.res || {};
        this.res.second = $2;
      }
    | // do nothing
    ;

second
    :  'SECOND' class
        {
          this.res = this.res || {};
          this.res.second = $2;
        }
    | // nothing
    ;
