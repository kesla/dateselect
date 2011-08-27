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
    : 'YEAR' class ltyear
      {
        this.res = this.res || {};
        this.res.year = $2
      }
    | ltyear
      {}
    ;

ltyear
    : 'MONTH' class ltmonth
        {
          this.res = this.res || {};
          this.res.month = $2;
        }
    | ltmonth
        {}
    ;

ltmonth
    : 'DAY' dayclass ltday
        {
          this.res = this.res || {};
          this.res.day = $2;
        }
    | ltday
        {}
    ;
ltday
    : 'HOUR' class lthour
        {
          this.res = this.res || {};
          this.res.hour = $2;
        }
    | lthour
        {}
    ;
lthour
    : 'MINUTE' class ltminute
        {
          this.res = this.res || {};
          this.res.minute = $2;
        }
    | ltminute
        {}
    ;

ltminute
    :  'SECOND' class
        {
          this.res = this.res || {};
          this.res.second = $2;
        }
    | // nothing
    ;
