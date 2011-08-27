/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
("year"|"y") 	        return 'YEAR'
("month"|"M")					return 'MONTH'
("day"|"d")           return 'DAY'
("hour"|"h")          return 'HOUR'
("minute"|"m")        return 'MINUTE'
("second"|"s")        return 'SECOND'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

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

year
    : 'YEAR' ltyear
      {
        this.res = this.res || {};
        this.res.year = -1;
      }
    | ltyear
      {}
    ;

ltyear
    : 'MONTH' ltmonth
    		{
          this.res = this.res || {};
          this.res.month = -1;
    		}
    | ltmonth
        {}
    ;

ltmonth
    :	'DAY' ltday
    		{
          this.res = this.res || {};
          this.res.day = -1;
    		}
    | ltday
        {}
    ;
ltday
    :	'HOUR' lthour
    		{
          this.res = this.res || {};
          this.res.hour = -1;
    		}
    | lthour
        {}
    ;
lthour
    :	'MINUTE' ltminute
    		{
          this.res = this.res || {};
          this.res.minute = -1;
    		}
    | ltminute
        {}
    ;

ltminute
    :	'SECOND'
    		{
          this.res = this.res || {};
          this.res.second = -1;
    		}
    | // nothing
    ;
