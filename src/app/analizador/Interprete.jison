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
[\t]                                {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column);  return 'IDENTADOR'}
[\n]                                {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'SALTO'} 
\s+                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); /*ignoramos */  }                
"Incerteza"                         {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'INSERTEZA'}
"Importar"                          {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'IMPORT'}
"."                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'PUNTO'}
"crl"                               {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'EXTENSIONCLR'} 
"true"                              {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'TRUE'}
"false"                             {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column);  return 'FALSE'}
\"[^\"]*\"                          {yytext = yytext.substr(1,yyleng-2); Parser.yy.errores.capturaTokenstring(yytext, yylloc.last_line, yylloc.last_column);  return 'CADENA'; }
"'"[^]"'"                           {yytext = yytext.substr(1,yyleng-2); Parser.yy.errores.capturaTokenstring(yytext, yylloc.last_line, yylloc.last_column);  return 'CARACTER'; }
"Double"                            {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'DOUBLE'}
"Boolean"                           {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'BOOLEAN'}
"Int"                               {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column);  return 'INT'}
"String"                            {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'STRING'}
"Char"                              {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'CHAR'}  
"Void"                              {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'VOID'}
"!="                                {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'NOEQUALS'}
"<="                                {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'MENOROI'}
">="                                {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'MAYOROI'}
"=="                                {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'EQUALS'}
"="                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'IGUAL'}
"!"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'NEGADO'}
"<"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'MENORQ'}
">"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'MAYORQ'}
"~"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'SIGINSERTEZA'}
"&&"                                {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column);  return 'AND'}
'||'                                {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'OR'}
'|&'                                {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'XOR'}
"Retorno"                           {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'RETURN'}
"Principal"                         {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'PRINCIPAL'}
"Sino"                              {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'SINO'}
"Si"                                {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'SI'}
"++"                                {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'MASMAS'}
"--"                                {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'MENOSMENOS'}
"Para"                              {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'PARA'}
"Mientras"                          {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'MIENTRAS'}
"Detener"                           {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'DETENER'}
"Continuar"                         {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'CONTINUAR'}
"Mostrar"                           {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'MOSTRAR'}
"{"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'LLAVEA'}
"}"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'LLAVEC'}
"DibujarAST"                        {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'DIBUJARAST'}
"DibujarEXP"                        {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'DIBUJAREXP'}
"DibujarTS"                         {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'DIBUJARTS'}
[0-9]+"."[0-9]+\b                   {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'DECIMAL'}
((_)?[a-zA-Z]+(_|[a-zA-Z0-9]+)*)    {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'IDD'}
[0-9]+\b                            {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'ENTERO'}
":"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'DOPUNTO'}
";"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'PUNTOCOMA'}
','                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'COMA'}
"*"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'POR'}
"/"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'DIVISION'}
"-"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'MENOS'}
"+"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'MAS'}
"^"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'ELEVADO'}
"%"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'MOD'}
"("                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'PARENTESISA'}
")"                                 {Parser.yy.errores.capturaTokens(yytext, yylloc.last_line, yylloc.last_column); return 'PARENTESISC'}
<<EOF>>                             {  return 'EOF'}
.                                    {Parser.yy.errores.capturaErrorLexico(yylloc.first_line, yylloc.first_column, yytex)}
/lex

/* operator associations and precedence */
%left OR XOR AND 
%left EQUALS NOEQUALS MAYORQ MAYOROI MENORQ MENOROI SIGINSERTEZA
%left MAS MENOS MOD
%left POR DIVISION
%left ELEVADO
%left UMINUS

%start inicio

%% /* language grammar */
inicio:
    saltos importacion insertez sentenciasGlobales
    | importacion insertez sentenciasGlobales
    ;

//IMPORTS
importacion :
        comodinImpor importacion {}
        |             
        ;

comodinImpor:
                IMPORT ID PUNTO EXTENSIONCLR saltos            {Parser.yy.table.anlizarImport($2+""+$3+""+$4)}
                | error saltos                                  {Parser.yy.errores.capturarErrorSintactico(this._$.first_line, this._$.first_column,yytext)} 
                ;

saltos : 
        SALTO saltos            {}
        | SALTO
        | EOF                           {}
        ;

insertez : 
             INSERTEZA DECIMAL saltos {Parser.yy.table.claseTem.valorInzerteza = Number($2) }
            | INSERTEZA ENTERO saltos    {Parser.yy.table.claseTem.valorInzerteza = Number($2) }
            |
            ;

//DECLARACION
variables:
        tipo items_coma         {$$ = $1}   
        ;

items_coma:
        comodinItems items   
        | error saltos             {Parser.yy.errores.capturarErrorSintactico(this._$.first_line, this._$.first_column,yytext)}              
        ;

comodinItems:
        ID                     {Parser.yy.table.claseTem.capturaItems(yytext)}
        ;

items :
        IGUAL asignacion                
        | COMA items_coma               
        | saltos  
        | error saltos                  {Parser.yy.errores.capturarErrorSintactico(this._$.first_line, this._$.first_column,yytext)}      
        ; 

tipo:
        DOUBLE      {tipoAux = Parser.yy.tipoVar.DOUBLE; $$ = yytext}    
        | INT       {tipoAux = Parser.yy.tipoVar.INT; $$ = yytext}          
        | BOOLEAN   {tipoAux = Parser.yy.tipoVar.BOOLEAN; $$ = yytext}          
        | CHAR      {tipoAux = Parser.yy.tipoVar.CHAR; $$ = yytext}
        | STRING    {tipoAux = Parser.yy.tipoVar.STRING; $$ = yytext}
        ;

//ASIGNACION
asignVar:
        ID IGUAL asignacion {$$ = $1}
        ;

asignacion :
            operation saltos    {contenidoVar = $1}
            | error saltos                              {Parser.yy.errores.capturarErrorSintactico(this._$.first_line, this._$.first_column,yytext)} 
            ;
//FUNCIONES
funtions : 
        comodinIDFun saltos sentenciasFuncion                      {Parser.yy.table.claseTem.capturarInstruccioneFuncion()}
        ;
 
comodinIDFun:
        comss  PARENTESISC DOPUNTO                   {Parser.yy.table.verificarFuncion()}
        | comss  parametros PARENTESISC DOPUNTO      {Parser.yy.table.verificarFuncion()}
        ;
comss:
        tipo ID  PARENTESISA              {Parser.yy.table.claseTem.instanciaNewFuncion($2,tipoAux)}        
        ;


retornoFuntion :
                RETURN operation saltos         {Parser.yy.table.verificadorRetorno($2)}
                | RETURN saltos                 {Parser.yy.table.verificarReturnMetod()}
                | error saltos                  {Parser.yy.errores.capturarErrorSintactico(this._$.first_line, this._$.first_column,yytext)} 
                ;

parametros:
        param COMA parametros
        | param
        | error saltos                  {Parser.yy.errores.capturarErrorSintactico(this._$.first_line, this._$.first_column,yytext)} 
        ;

param:
        tipo ID                                {Parser.yy.table.claseTem.capturarParametros($2,tipoAux)}
        ;

sentenciasFuncion:
                sentenciaFn sentenciasFuncion           {Parser.yy.table.controlCero()}
                | sentenciaFn                           {Parser.yy.table.controlCero()}
                | error saltos                          {Parser.yy.errores.capturarErrorSintactico(this._$.first_line, this._$.first_column,yytext)} 
                ;

sentenciaFn:
        identadorRecu variables                         {Parser.yy.table.claseTem.capturarVariableFuncion(tipoAux,contenidoVar); contenidoVar = null; Parser.yy.table.scope = 0; Parser.yy.table.verificadorScope(false,false, false,$2)}
        | identadorRecu asignVar                        {Parser.yy.table.asignarValorVarFunOGlobal($2,contenidoVar); contenidoVar = null; Parser.yy.table.scope = 0; Parser.yy.table.verificadorScope(false,false, false,$2)}
        | identadorRecu defSi                           {Parser.yy.table.verificadorScope(true,false, true,"Si"); contenidoVar = null; Parser.yy.table.scope = 0; }
        | identadorRecu defMientras                     {Parser.yy.table.verificadorScope(false,false, true,"Mientras"); contenidoVar = null; Parser.yy.table.scope = 0; }
        | identadorRecu defPara                         {Parser.yy.table.verificadorScope(false,false, true,"Para"); contenidoVar = null; Parser.yy.table.scope = 0; }
        | identadorRecu defMostrar                      {Parser.yy.table.verificadorScope(false,false, false,"Mostrar"); contenidoVar = null; Parser.yy.table.scope = 0; }
        | identadorRecu defSino                         {Parser.yy.table.verificadorScope(false,true, true,"Sino"); contenidoVar = null; Parser.yy.table.scope = 0; }
        | identadorRecu retornoFuntion                  {Parser.yy.table.verificadorScope(false,false, false,"Retorno"); contenidoVar = null; Parser.yy.table.scope = 0; }
        | identadorRecu llamadaFun                      {Parser.yy.table.verificadorScope(false,false, false,$2); Parser.yy.table.valoFuncion($2+"", false, false); contenidoVar = null; Parser.yy.table.scope = 0; }
        | identadorRecu graficando                      {Parser.yy.table.verificadorScope(false,false, false,$2); contenidoVar = null; Parser.yy.table.scope = 0; }
        ;

identadorRecu : 
                comodinIdentado identadorRecu
                | comodinIdentado
                ;

comodinIdentado:
        IDENTADOR               {Parser.yy.table.scope++; scope++; Parser.yy.table.scopeVerific++;}
        ;

//METODOS
metod :
        comodinVerificador DOPUNTO saltos sentenciasMetod               {Parser.yy.table.claseTem.capturarInstruccioneFuncion()}
        ;

comodinVerificador:
                comodinMetod PARENTESISC                        {Parser.yy.table.verificarFuncion();}
                | comodinMetod parametros PARENTESISC           {Parser.yy.table.verificarFuncion();}
                ;       

comodinMetod:
        VOID ID PARENTESISA            {Parser.yy.table.claseTem.instanciaNewFuncion($2,Parser.yy.tipoVar.VOID)}
        ;

sentenciasMetod :
                sentenciaFn sentenciasMetod
                | sentenciaFn
                | error saltos                  {Parser.yy.errores.capturarErrorSintactico(this._$.first_line, this._$.first_column,yytext)} 
                ;


//PRINCIPAL
funPrincipal :
               comodinFunPrim saltos sentenciasFuncion {Parser.yy.table.claseTem.capturarInstruccioneFuncion()}
                ;

comodinFunPrim:
                VOID PRINCIPAL PARENTESISA PARENTESISC DOPUNTO  {Parser.yy.table.claseTem.instanciaNewFuncion($2,Parser.yy.tipoVar.VOID)}
        ;

        
//LLAMADAS
llamadaFun :
        ID PARENTESISA PARENTESISC saltos      {$$ = $1}
        | ID PARENTESISA parametrosLlamada PARENTESISC saltos  {$$ = $1}
        ;

llamadaFunOP:
        ID PARENTESISA PARENTESISC     {$$ = $1}
        | ID PARENTESISA parametrosLlamada PARENTESISC {$$ = $1}
        ;

parametrosLlamada :
                comoidnOP COMA parametrosLlamada
                | comoidnOP
                | error saltos                  {Parser.yy.errores.capturarErrorSintactico(this._$.first_line, this._$.first_column,yytext)} 

                ;

comoidnOP:
        operation               {Parser.yy.table.capturarParametros($1)}
        ;

//SENTENCIAS
sentenciasGlobales : 
                sentenciaGlobales sentenciasGlobales
                |
                ;

sentenciaGlobales :
                funtions                {Parser.yy.table.existReturn()}
                | asignVar              {Parser.yy.table.asignarValorVarGlobal($1+"",contenidoVar); contenidoVar = null}
                | variables             {Parser.yy.table.capturarVariableGlobal(tipoAux,contenidoVar);contenidoVar = null} 
                | metod                 {}
                | funPrincipal
                ;

//SI SINO

defSi : 
        SI PARENTESISA operation PARENTESISC DOPUNTO saltos     {Parser.yy.table.validarSi($3)}
        ;

defSino : 
        SINO DOPUNTO saltos                     {}
        ;


//PARA
defPara:
        PARA PARENTESISA INT ID IGUAL operation PUNTOCOMA operation PUNTOCOMA incremDecrem PARENTESISC DOPUNTO saltos
        ;

incremDecrem :
                MASMAS
                | MENOSMENOS
                ;
//MIENTRAS
defMientras :
                MIENTRAS PARENTESISA operation PARENTESISC DOPUNTO saltos
                ;

//MOSTRAR
defMostrar : 
                MOSTRAR PARENTESISA parametroMostrar PARENTESISC saltos {/*verificar que el primer item sea string*/}
                ;

parametroMostrar :
                stringOidd COMA parametroMostrar
                | stringOidd
                | error saltos                  {Parser.yy.errores.capturarErrorSintactico(this._$.first_line, this._$.first_column,yytext)} 
                ;
stringOidd : 
        operation                       {/*atrapar el itema para verificar su contenido*/}
        ;

//EXPRESION GRAFICA 
graficando :  
        DIBUJAREXP PARENTESISA operation PARENTESISC saltos             {}
        ;

/*terminales soportados para las expresiones(relacionales, aritmeticas y logicas)*/
terminalsOP :
            TRUE                {$$ = true; }
            | FALSE             {$$ = false; }
            | DECIMAL           {$$ = Number(yytext); }
            | ENTERO            {$$ = Number(yytext); }
            | CARACTER          {$$ = yytext; }
            | CADENA            {$$ = yytext; }
            | ID               {$$ = Parser.yy.table.contenidoVariable($1+"");}
            | llamadaFunOP      {$$ = Parser.yy.table.valoFuncion($1+"", true, false)}
            ;

//EXPRESIONES
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
        | operation SIGINSERTEZA operation         {$$ = Parser.yy.opRelatins.comparacionIncertezaF($1,$3)}
        | operation OR operation                   {$$ = Parser.yy.opRelatins.expresionOR($1,$3)}
        | operation AND operation                  {$$ = Parser.yy.opRelatins.expresionAnd($1,$3)}
        | operation XOR operation                  {$$ = Parser.yy.opRelatins.expresionXOR($1,$3)}
	| PARENTESISA operation PARENTESISC        {$$ = $2} 
        | terminalsOP                              {$$ = $1}         	        			 														
    ;