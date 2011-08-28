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
"."[0-9]+"am"             return 'AM'
"."[0-9]+"pm"             return 'PM'
":nth("[1-9][0-9]*")"     return 'NTH'
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
    : prepare year EOF
      {return this.result;}
    ;

prepare
    :
      {this.result = {};}
    ;

dayclass
    : 'DAYCLASS'
      {$$ = yytext.slice(1);}
    | class
      {$$ = $1}
    ;

class
    : 'CLASS'
      {$$ = Number(yytext.slice(1));}
    | 'NTH'
      {$$ = {"nth" : Number(yytext.slice(5,-1))};}
    |
      {$$ = -1}
    ;

year
    : 'YEAR' class brmonth month
      {this.result.year = $2}
    | month
    ;

brmonth
    : '>' class brday
      {this.result.month = $2}
    | // do nothing
    ;

month
    : 'MONTH' class brday day
      {this.result.month = $2;}
    | day
    ;

brday
    : '>' class brhour
      {this.result.day = $2}
    | // do nothing
    ;
day
    : 'DAY' dayclass brhour hour
      {this.result.day = $2;}
    | hour
    ;
brhour
    : '>' class brminute
      {this.result.hour = $2;}
    | // do nothing
    ;
hour
    : 'HOUR' ampm brminute minute
      {this.result.hour = $2;}
    | minute
    ;

ampm
    : 'AM'
      {$$ = Number(yytext.slice(1, -2))%12;}
    | 'PM'
      {$$ = Number(yytext.slice(1, -2))%12 + 12;}
    | class
      {$$ = $1;}
    ;

brminute
    : '>' class brsecond
      {this.result.minute = $2}
    | // do nothing
    ;

minute
    : 'MINUTE' class brsecond second
      {this.result.minute = $2;}
    | second
    ;

brsecond
    : '>' class
      {this.result.second = $2;}
    | // do nothing
    ;

second
    :  'SECOND' class
      {this.result.second = $2;}
    | // nothing
    ;
