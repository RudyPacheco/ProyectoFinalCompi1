/* description: Parses and executes mathematical expressions. */
%{
let tipoAux
let contenidoVar = null
let scope = 0
let operationCondicion = ""
let capturarOperadors = false
%}
/* lexical grammar */

%lex
%options case-sensitive
%%
"!!".*	                             {/*Comentario de una linea*/}
\'\'\'(.|\f|\n|\r|\s|\t)*\'\'\'      {/*comentrio multilinea xd*/    }
[\t]                                { return 'IDENTADOR'}
[\n]                                { return 'SALTO'} 
\s+                                 { /*ignoramos */  }                
"Importar"                          { return 'IMPORT'}
"."                                 { return 'PUNTO'}
"crl"                               { return 'EXTENSIONCLR'} 
"Incerteza"                         { return 'INSERTEZA'}
"true"                              { return 'TRUE'}
"false"                             {  return 'FALSE'}
\"[^\"]*\"                          {yytext = yytext.substr(1,yyleng-2);   return 'CADENA'; }
"'"[^]"'"                           {yytext = yytext.substr(1,yyleng-2);   return 'CARACTER'; }
"Double"                            {return 'DOUBLE'}
"Boolean"                           {return 'BOOLEAN'}
"Int"                               { return 'INT'}
"String"                            {return 'STRING'}
"Char"                              {return 'CHAR'}  
"Void"                              {return 'VOID'}
"!="                                {return 'NOEQUALS'}
"<="                                {return 'MENOROI'}
">="                                {return 'MAYOROI'}
"=="                                {return 'EQUALS'}
"="                                 {return 'IGUAL'}
"!"                                 {return 'NEGADO'}
"<"                                 {return 'MENORQ'}
">"                                 {return 'MAYORQ'}
"~"                                 {return 'SIGINSERTEZA'}
"|&"                                {return 'XOR'}
"&&"                                {return 'AND'}
"||"                                {return 'OR'}
"Retorno"                           {return 'RETURN'}
"Principal"                         {return 'PRINCIPAL'}
"Sino"                              {return 'SINO'}
"Si"                                {return 'SI'}
"++"                                {return 'MASMAS'}
"--"                                {return 'MENOSMENOS'}
"Para"                              {return 'PARA'}
"Mientras"                          {return 'MIENTRAS'}
"Detener"                           {return 'DETENER'}
"Continuar"                         {return 'CONTINUAR'}
"Mostrar"                           {return 'MOSTRAR'}
"{"                                 {return 'LLAVEA'}
"}"                                 {return 'LLAVEC'}
"DibujarAST"                        {return 'DIBUJARAST'}
"DibujarEXP"                        {return 'DIBUJAREXP'}
"DibujarTS"                         {return 'DIBUJARTS'}
[0-9]+"."[0-9]+\b                   {return 'DECIMAL'}
((_)?[a-zA-Z]+(_|[a-zA-Z0-9]+)*)    {return 'IDD'}
[0-9]+\b                            {return 'ENTERO'}
":"                                 {return 'DOPUNTO'}
";"                                 {return 'PUNTOCOMA'}
','                                 {return 'COMA'}
"*"                                 {return 'POR'}
"/"                                 {return 'DIVISION'}
"-"                                 {return 'MENOS'}
"+"                                 {return 'MAS'}
"^"                                 {return 'ELEVADO'}
"%"                                 {return 'MOD'}
"("                                 {return 'PARENTESISA'}
")"                                 {return 'PARENTESISC'}
<<EOF>>                             {  return 'EOF'}
.                     //manejo de errores lexicos
/lex

%left OR XOR AND 
%left EQUALS NOEQUALS MAYORQ MAYOROI MENORQ MENOROI SIGINSERTEZA
%left MAS MENOS MOD
%left POR DIVISION
%left ELEVADO
%left UMINUS


%start inicio

%%

inicio :
        saltos sentenciasFuncion
        |sentenciasFuncion
        | error saltos
    ;
saltos : 
        SALTO saltos                      {}
        | SALTO
        | EOF                           {}
        ;



identadorRecu : 
                comodinIdentado identadorRecu
                | comodinIdentado
                ;
comodinIdentado:
        IDENTADOR               {Parser.yy.fun.scope++}
        ;


variables:
        tipo items_coma         {Parser.yy.fun.actulizarValorDeclara()}  
        | error    saltos
        ;

items_coma:
        comodinItems items                             
        ;

comodinItems:
        IDD                     {Parser.yy.fun.capturarIdentificadores($1) }
        ;

items :
        IGUAL asignacion                
        | COMA items_coma               
        | saltos  
        | error saltos              
        ; 

tipo:
        DOUBLE      {tipoAux = Parser.yy.tipoVar.DOUBLE}    
        | INT       {tipoAux = Parser.yy.tipoVar.INT}          
        | BOOLEAN   {tipoAux = Parser.yy.tipoVar.BOOLEAN}          
        | CHAR      {tipoAux = Parser.yy.tipoVar.CHAR}  
        | STRING    {tipoAux = Parser.yy.tipoVar.STRING}          
        ;

/*define la asignacion de una variable ya creada*/
asignVar:
        IDD IGUAL asignacion {Parser.yy.fun.capturarIdentificadores($1); Parser.yy.fun.actulizarValorAsig(Parser.yy.table)}
        ;

asignacion :
            operation saltos    {Parser.yy.fun.contenidVar = $1}
            | error saltos
            ;

retornoFuntion :
                RETURN operation saltos         {Parser.yy.fun.capturarRetorno($2)}
                | RETURN saltos                 {}
                ;

sentenciasFuncion:
                sentenciaFn sentenciasFuncion
                | sentenciaFn
                ;

sentenciaFn:
        identadorRecu variables                         {Parser.yy.fun.scope = 0}
        | identadorRecu asignVar                        {Parser.yy.fun.scope = 0}
        | identadorRecu defSi                           {Parser.yy.fun.scope = 0}                                                
        | identadorRecu defMientras                     {Parser.yy.fun.scope = 0}
        | identadorRecu defPara                         {Parser.yy.fun.scope = 0}
        | identadorRecu defMostrar                      {Parser.yy.fun.scope = 0}
        | identadorRecu defSino                         {Parser.yy.fun.scope = 0}
        | identadorRecu retornoFuntion                  {Parser.yy.fun.scope = 0}
        | identadorRecu llamadaFun                      {Parser.yy.table.valoFuncion($2+"", false, Parser.yy.fun.realizar()); Parser.yy.fun.scope = 0;}
        | identadorRecu graficando                      {Parser.yy.fun.scope = 0; }
        | error 
        ;

llamadaFun :
        IDD PARENTESISA PARENTESISC saltos      {$$ = $1}
        | IDD PARENTESISA parametrosLlamada PARENTESISC saltos          {$$ = $1}
        | error 
        ;

llamadaFunOP:
        IDD PARENTESISA PARENTESISC                     {$$ = $1}
        | IDD PARENTESISA parametrosLlamada PARENTESISC         {$$ = $1}
        ;

parametrosLlamada :
                comoidnOP COMA parametrosLlamada
                | comoidnOP
                | error saltos
                ;

comoidnOP:
        operation               {Parser.yy.table.capturarParametros($1)}
        ;

/*define la sentencia si - sino*/

defSi : 
        SI PARENTESISA operation PARENTESISC DOPUNTO saltos     {Parser.yy.fun.capturarValorSi($3)}
        ;

defSino : 
        SINO DOPUNTO saltos                     {Parser.yy.fun.capturarValorSino()}
        ;


/*define la sentencia para */
defPara:
        PARA PARENTESISA INT IDD IGUAL operation PUNTOCOMA operation PUNTOCOMA incremDecrem PARENTESISC DOPUNTO saltos {}
        ;

incremDecrem :
                MASMAS
                | MENOSMENOS
                ;

/*define la sentencia mientras*/
defMientras :
                MIENTRAS PARENTESISA operation PARENTESISC DOPUNTO saltos
                ;

/*define la sentencia Mostrar*/
defMostrar : 
                MOSTRAR PARENTESISA parametroMostrar PARENTESISC saltos {Parser.yy.fun.realizarMostrar(Parser.yy.table)}
                ;

parametroMostrar :
                stringOidd COMA parametroMostrar
                | stringOidd
                | error saltos
                ;
stringOidd : 
        operation        { Parser.yy.fun.capturarItems($1)}
        ;

/*terminales soportados para las expresiones(relacionales, aritmeticas y logicas)*/
terminalsOP :
            TRUE                {$$ = true; }
            | FALSE             {$$ = false; }
            | DECIMAL           {$$ = Number(yytext); }
            | ENTERO            {$$ = Number(yytext); }
            | CARACTER          {$$ = yytext; }
            | CADENA            {$$ = yytext; }
            | IDD               {$$ = Parser.yy.table.contenidoVariableIstr($1+"", Parser.yy.fun);}
            | llamadaFunOP      {$$ = Parser.yy.table.valoFuncion($1+"",true, Parser.yy.fun.realizar())}
            ;

/*define el lenguje de una expresion(relacional, aritmetica y logica)*/
operation :
        operation MAS operation	                   {$$ = Parser.yy.opCast.suma($1,$3); }   	
        | operation MENOS operation       	   {$$ = Parser.yy.opCast.resta($1,$3)}	
	| operation POR operation                  {$$ = Parser.yy.opCast.multiplicacion($1,$3)}  		
        | operation DIVISION operation             {$$ = Parser.yy.opCast.division($1,$3)}
        | operation ELEVADO  operation             {$$ = Parser.yy.opCast.potencia($1,$3)}
        | operation MOD operation                  {$$ = Parser.yy.opCast.modulo($1,$3)}
        | MENOS operation %prec UMINUS             {$$ = Parser.yy.opCast.negativo($2);}
        | NEGADO operation %prec UMINUS            {$$ = Parser.yy.opRelatins.expresionNegation($2)}
        | operation EQUALS operation               {$$ = Parser.yy.opRelatins.expresionEquals($1,$3)}
        | operation NOEQUALS operation             {$$ = Parser.yy.opRelatins.expresioNoEquals($1,$3)}
        | operation MENORQ operation               {$$ = Parser.yy.opRelatins.expresioMenorQ($1,$3)}
        | operation MAYORQ operation               {$$ = Parser.yy.opRelatins.expresioMayorQ($1,$3)}
        | operation MENOROI operation              {$$ = Parser.yy.opRelatins.expresioMenorOI($1,$3)}
        | operation MAYOROI operation              {$$ = Parser.yy.opRelatins.expresioMayorOI($1,$3)}
        | operation SIGINSERTEZA operation         {$$ = Parser.yy.opRelatins.comparacionIncerteza($1,$3,Parser.yy.fun)}
        | operation OR operation                   {$$ = Parser.yy.opRelatins.expresionOR($1,$3)}
        | operation AND operation                  {$$ = Parser.yy.opRelatins.expresionAnd($1,$3)}
        | operation XOR operation                  {$$ = Parser.yy.opRelatins.expresionXOR($1,$3)}
        | PARENTESISA operation PARENTESISC        {$$ = $2} 
        | terminalsOP                              {$$ = $1}        	        			 														
        ;

graficando :  
                DIBUJAREXP PARENTESISA operationGrafica PARENTESISC saltos             {Parser.yy.fun.agregarNodoArbol(Parser.yy.arbol, $3)}
                ;
                 
operationGrafica :
        operationGrafica MAS operationGrafica	                        {$$ = new Parser.yy.nodo("+","Aritm",[$1,$3]);}   	
        | operationGrafica MENOS operationGrafica       	        {$$ = new Parser.yy.nodo("-","Aritm",[$1,$3]);}	
	| operationGrafica POR operationGrafica                         {$$ = new Parser.yy.nodo("*","Aritm",[$1,$3]);}  		
	| operationGrafica DIVISION operationGrafica                    {$$ = new Parser.yy.nodo("/","Aritm",[$1,$3]); }
        | operationGrafica ELEVADO  operationGrafica                    {$$ = new Parser.yy.nodo("+","Aritm",[$1,$3]);}
        | operationGrafica MOD operationGrafica                         {$$ = new Parser.yy.nodo("%","MOD",[$1,$3]);}
        | MENOS operationGrafica %prec UMINUS                           {$$ = new Parser.yy.nodo("-","Aritm",[$1,$3]);}
        | NEGADO operationGrafica %prec UMINUS                          {$$ = new Parser.yy.nodo("!","Logica",[$1,$3]);}
        | operationGrafica EQUALS operationGrafica                      {$$ = new Parser.yy.nodo("==","Relacio",[$1,$3]);}
        | operationGrafica MENORQ operationGrafica                      {$$ = new Parser.yy.nodo("<","Relacio",[$1,$3]);}
        | operationGrafica MAYORQ operationGrafica                      {$$ = new Parser.yy.nodo(">","Relacio",[$1,$3]);}
        | operationGrafica MENOROI operationGrafica                     {$$ = new Parser.yy.nodo("<=","Relacio",[$1,$3]);}
        | operationGrafica MAYOROI operationGrafica                     {$$ = new Parser.yy.nodo(">=","Relacio",[$1,$3]);}
        | operationGrafica SIGINSERTEZA operationGrafica                {$$ = new Parser.yy.nodo("~","Insert",[$1,$3]);}
        | operationGrafica OR operationGrafica                          {$$ = new Parser.yy.nodo("||","Logica",[$1,$3]);}
        | operationGrafica AND operationGrafica                         {$$ = new Parser.yy.nodo("&&","Logica",[$1,$3]);}
        | operationGrafica XOR operationGrafica                         {$$ = new Parser.yy.nodo("|&","Logica",[$1,$3]); }
	| PARENTESISA operationGrafica PARENTESISC                      {$$ = $2} 
        | DECIMAL                                                       {$$ = new Parser.yy.nodo($1,"Double",[]);}
        | ENTERO                                                        {$$ = new Parser.yy.nodo($1,"Number",[]);}
        | TRUE                                                          {$$ = new Parser.yy.nodo("true","Boolean",[]);}
        | FALSE                                                         {$$ = new Parser.yy.nodo("false","Boolean",[]);}
        | CARACTER                                                      {$$ = new Parser.yy.nodo($1,"Caracter",[]);}
        | CADENA                                                        {$$ = new Parser.yy.nodo($1,"Cadena",[]);}
        | IDD                                                           {$$ = new Parser.yy.nodo($1,"Variable",[]);}
    ;