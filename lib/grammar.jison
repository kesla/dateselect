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
    : 'YEAR' EOF
        {
        	return {
        		'year' : '*'
        	};
        }
    |	'MONTH' EOF
    		{
    			return {
    				month: '*'
    			};
    		}
    |	'DAY' EOF
    		{
    			return {
    				day: '*'
    			};
    		}
    |	'HOUR' EOF
    		{
    			return {
    				hour: '*'
    			};
    		}
    |	'MINUTE' EOF
    		{
    			return {
    				minute: '*'
    			};
    		}
    |	'SECOND' EOF
    		{
    			return {
    				second: '*'
    			};
    		}
    ;

