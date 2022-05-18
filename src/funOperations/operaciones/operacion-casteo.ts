import { ManejoErrors } from "../errores/error-manejo"

export class OperationCasteo {

  errores: ManejoErrors

  constructor(errores: ManejoErrors){
    this.errores = errores
  }

  public negativo(valor: any): number{
    if ("number" == typeof valor) {
      return valor*-1
    } else {
      //error no se puede negar valores no numericos xd
      this.errores.capturaExpresiones("Solo se pueden negar numeros", valor)
      return 0
    }
  }

  public multiplicacion(valor1: any, valor2: any): any {
    let resultado;
    if (valor1 != undefined && valor2 != undefined) {
      if ("boolean" == typeof valor1) {
        resultado = this.multiBoolean(valor1, valor2);
      } else if ("number" == typeof valor1) {
        resultado = this.multiNumber(valor1, valor2);
      } else if ("string" == typeof valor1 && valor1.length == 1) {
        resultado = this.multiChar(valor1, valor2);
      } else {
        //error no se puede multiplicar un string con otros valores
        // console.log("multiplicacion")
        this.errores.capturaExpresiones("String no es multiplicable", valor1+"")
        resultado = 0;
      }
    } else {
      resultado = 0;
    }

    return resultado;
  }

  public division(valor1: any, valor2: any): any {
    let result;
    if ("boolean" == typeof valor1) {
      result = this.divBoolean(valor1, valor2);
    } else if ("number" == typeof valor1) {
      result = this.divNumber(valor1, valor2);
    } else if ("string" == typeof valor1 && valor1.length == 1) {
        result = this.divChar(valor1, valor2)
    }else{
        //erro no se puede dividir un string dentro de ninguna otra variable
        this.errores.capturaExpresiones("String no es dividible", valor1)
        result = 0
    }

    return result;
  }

  public potencia(valor1: any, valor2: any): any{
      let resultado
    if("boolean" == typeof valor1){
        resultado = this.potenciaBoolean(valor1, valor2)
    }else if ("string" == typeof valor1 && valor1.length == 1) {
        resultado = this.potenciaChar(valor1, valor2)
    } else if ("number" == typeof valor1) {
        resultado = this.potenciaNumber(valor1, valor2)
    } else{
        //erro no se pude efecutar ninguna operacion de potencia a un string
        this.errores.capturaExpresiones("String no es potenciable", valor1)

        resultado = 0
    }

    return resultado
  }

  public modulo(valor1: any, valor2: any): any {
      let restultado
    if ("boolean" == typeof valor1) {
        restultado = this.modBool(valor1, valor2)
    } else  if ("number" == typeof valor1) {
        restultado = this.modNumber(valor1, valor2)
    } else if ("string" == typeof valor1 && valor1.length == 1) {
        restultado = this.modChar(valor1, valor2)
    } else{
        // erro no se pude dividir un strign dentro de otras variables xd
        this.errores.capturaExpresiones("String no es dividible ", valor1)
        restultado = 0
    }
    return restultado
  }

  public resta(valor1: any, valor2: any): any {
    let resultado;
    if (valor1 != undefined && valor2 != undefined) {
      if ("boolean" == typeof valor1) {
        resultado = this.restaBoolean(valor1, valor2);
      } else if ("number" == typeof valor1) {
        resultado = this.restaNumber(valor1, valor2);
      } else if ("string" == typeof valor1 && valor1.length == 1) {
        resultado = this.restaChar(valor1, valor2);
      } else {
        //error no se puede restarle ningun valor a un string
        this.errores.capturaExpresiones("String no se puede restar ", valor1)
        resultado = 0;
      }
    } else {
      resultado = 0;
    }

    return resultado;
  }


  public suma(valor1: any, valor2: any): any {
    let resultaod;
    if (valor1 != undefined && valor2 != undefined) {
      if ("boolean" == typeof valor1) {
        resultaod = this.sumaBoolean(valor1, valor2);
      } else if ("number" == typeof valor1) {
        resultaod = this.sumaNumber(valor1, valor2);
      } else if ("string" == typeof valor1 && valor1.length != 1) {
        resultaod = this.sumaString(valor1, valor2);
      } else {
        resultaod = this.sumaChar(valor1, valor2);
      }
    } else {
      resultaod = 0;
    }
    return resultaod;
  }

  private sumaBoolean(valor1: boolean, valor2: any): any {
    let resultado;
    if ("boolean" == typeof valor2) {
      resultado = this.sumaBoolMBoo(valor1, valor2);
    } else if ("number" == typeof valor2) {
      resultado = this.sumaBoolenaMnumber(valor1, valor2);
    } else if ("string" == typeof valor2 && valor2.length != 1) {
      resultado = this.sumaBoolenMString(valor1, valor2);
    } else {
      this.errores.capturaExpresiones("No se puede sumar un boolean y un char", valor2)
      resultado = 0;
    }
    return resultado;
  }

  private sumaNumber(valor1: number, valor2: any): any {
    let result;
    if ("boolean" == typeof valor2) {
      result = this.sumaBoolenaMnumber(valor2, valor1);
    } else if ("number" == typeof valor2) {
      result = valor1 + valor2;
    } else if ("string" == typeof valor2 && valor2.length != 1) {
      result = valor1 + '' + valor2;
    } else {
      result = valor1 + valor2.charCodeAt(0);
    }
    return result;
  }

  private sumaString(valor1: String, valor2: any): String {
    return valor1 + '' + valor2;
  }

  private sumaChar(valor1: String, valor2: any): any {
    let result;
    if ("boolean" == typeof valor2) {
      //error char + boolean
      this.errores.capturaExpresiones("No se puede realizar una Suma de Char y un Boolean ", valor1+"")
      result = 0;
    } else if ("number" == typeof valor2) {
      result = valor1.charCodeAt(0) + valor2;
    } else if ("string" == typeof valor2 && valor2.length != 1) {
      result = valor1 + '' + valor2;
    } else {
      result = valor1.charCodeAt(0) + valor2.charCodeAt(0);
    }

    return result;
  }

  private sumaBoolMBoo(valor1: boolean, valor2: boolean): number {
    let resultado: number;
    if (valor1 && valor2) {
      resultado = 1.0 + 1.0;
    } else if (valor1 || valor2) {
      resultado = 1.0;
    } else {
      resultado = 0.0;
    }
    return resultado;
  }

  private sumaBoolenaMnumber(valor1: boolean, valor2: number): number {
    let resultado: number;
    if (valor1) {
      resultado = 1 + valor2;
    } else {
      resultado = 0 + valor2;
    }
    return resultado;
  }

  private sumaBoolenMString(valor1: boolean, valor2: String): String {
    let resultado: String;
    if (valor1) {
      resultado = '1' + valor2;
    } else {
      resultado = '0' + valor2;
    }
    return resultado;
  }

  private restaBoolean(valor1: boolean, valor2: any): any {
    let result;
    if ("boolean" == typeof valor2) {
      //error no se puede restar boolean - boolean
      this.errores.capturaExpresiones("No se puede restar booleans ", valor2+"")
    } else if ("number" == typeof valor2) {
      result = this.restaBoolNumber(valor1, valor2);
    } else if ("string" == typeof valor2) {
      //error no se puede restar boolean - string | char
      this.errores.capturaExpresiones("No se puede restar boolean y string", valor2)
      result = 0;
    } else {
      result = 0;
    }

    return result;
  }

  private restaBoolNumber(valor1: boolean, valor2: number): number {
    let result;
    if (valor1) {
      result = 1 - valor2;
    } else {
      result = 0 - valor2;
    }
    return result;
  }

  private restaNumber(valor1: number, valor2: any): any {
    let result;
    if ("boolean" == typeof valor2) {
      result = this.restaNumberBoolen(valor1, valor2);
    } else if ("number" == typeof valor2) {
      result = valor1 - valor2;
    } else if ("string" == typeof valor2 && valor2.length == 1) {
      result = valor1 - valor2.charCodeAt(0);
    } else {
      //erro no se puede resta double-string
      this.errores.capturaExpresiones("No se puede restar double con un String ", valor2)
      result = 0;
    }
    return result;
  }

  private restaNumberBoolen(valor1: number, valor2: boolean): number {
    let result;
    if (valor2) {
      result = valor1 - 1;
    } else {
      result = valor1 - 0;
    }
    return result;
  }

  private restaChar(valor1: string, valor2: any): any {
    let result;
    if ("boolean" == typeof valor2) {

      this.errores.capturaExpresiones("No se puede reascar un char y un boolean ", valor1)
    } else if ("number" == typeof valor2) {
      result = valor1.charCodeAt(0) - valor2;
    } else if ("string" == typeof valor2 && valor2.length == 1) {
      result = valor1.charCodeAt(0) - valor2.charCodeAt(0);
    } else {

      this.errores.capturaExpresiones("No se puede restar char y string ", valor1)

    }
    return result;
  }

  private multiBoolean(valor1: boolean, valor2: any): any {
    let resultado;
    if ("boolean" == typeof valor2) {
 
      this.errores.capturaExpresiones("No se puede multiplicar booleans", valor2+"")
    } else if ("number" == typeof valor2) {
      resultado = this.multiBoolNumber(valor1, valor2);
    } else {

      this.errores.capturaExpresiones("No se puede multiplicar entre boolean , string y char ", valor2)
      resultado = 0;
    }

    return resultado;
  }

  private multiBoolNumber(valor1: boolean, valor2: number): number {
    let resultado: number;
    if (valor1) {
      resultado = 1 * valor2;
    } else {
      resultado = 0;
    }
    return resultado;
  }

  private multiNumber(valor1: number, valor2: any): any {
    let result;
    if ("boolean" == typeof valor2) {
      result = this.multiBoolNumber(valor2, valor1);
    } else if ("number" == typeof valor2) {
      result = valor1 * valor2;
    } else if ("string" == typeof valor2 && valor2.length == 1) {
      result = valor1 * valor2.charCodeAt(0);
    } else {

      this.errores.capturaExpresiones("no se puede mutplicar un numero y un string ", valor2+"")
      result = 0;
    }
    return result;
  }

  private multiChar(valor1: String, valor2: any): any {
    let result;
    if ("boolean" == typeof valor2) {
   
      this.errores.capturaExpresiones("no se puede multiplicar un char y un boolean ", valor1+"")
      result = 0;
    } else if ("number" == typeof valor2) {
      result = valor1.charCodeAt(0) * valor2;
    } else if ("string" == typeof valor2 && valor2.length == 1) {
      result = valor1.charCodeAt(0) * valor2.charCodeAt(0);
    } else {
      //error no se puede multimplicar un char con un string
      this.errores.capturaExpresiones("no se puede multiplicar un char y un string", valor2)
      result = 0;
    }
    return result;
  }

  private divBoolean(valor1: Boolean, valor2: any): any {
    let result;
    if ("boolean" == typeof valor2) {

      this.errores.capturaExpresiones("no se puede dividir boolenas", valor2+"")
      result = 0;
    } else if ("number" == typeof valor2) {
      result = this.divBooleanNumber(valor1, valor2);
    } else {

      this.errores.capturaExpresiones("No se puede dividir entre boolean y string", valor2+"")
      result = 0;
    }

    return result;
  }

  private divBooleanNumber(valor1: Boolean, valor2: number): number {
    if (valor1) {
      return 1 / valor2;
    } else {
      return 0;
    }
  }

  private divNumber(valor1: number, valor2: any): any {
    let resutl;
    if ("boolean" == typeof valor2) {
      resutl = this.divNumberBoolesn(valor1, valor2);
    } else if ("number" == typeof valor2 && valor2 != 0) {
      resutl = valor1 / valor2;
    } else if ("string" == typeof valor2) {
   
      this.errores.capturaExpresiones("No se puede dividir numero entre string", valor2+"")
      resutl = 0;
    } else {
   
      this.errores.capturaExpresiones("no se puede dividir entre 0", valor2+"")
      resutl = 0;
    }

    return resutl;
  }

  private divNumberBoolesn(valor1: number, valor2: boolean): number {
    if (valor2) {
      return valor1;
    } else {
     
      this.errores.capturaExpresiones("No se puede dividir (false) - 0", valor2+"")
      return 0;
    }
  }

  private divChar(valor1: string, valor2: any): any {
    let resutl;
    if ("boolean" == typeof valor2) {
      
      this.errores.capturaExpresiones("No se puede dividir char y boolean", valor2+"")
      resutl = 0;
    } else if ("number" == typeof valor2) {
      resutl = valor1.charCodeAt(0) / valor2;
    } else if ("string" == typeof valor2 && valor2.length == 1) {
      resutl = valor1.charCodeAt(0) / valor2.charCodeAt(0);
    } else {
 
      this.errores.capturaExpresiones("No se puede dividir char y string", valor2+"")
      resutl = 0;
    }
    return resutl;
  }

  private modBool(valor1: boolean, valor2: any): any{
    let result
    if ("boolean" == typeof valor2) {

        this.errores.capturaExpresiones("No se puede obtener residuo entre booleans", valor2+"")
        result = 0
    } else if ("number" == typeof valor2) {
        result = this.modBoolNumber(valor1, valor2)
    } else  {
   
        this.errores.capturaExpresiones("No se puede obtener residuo entre string y cadenas", valor2+"")
        result = 0
    }

    return result
  }

  private modBoolNumber(valor1: boolean, valor2: number): number{
    let result
    if (valor2 == 0) {
        //erro no se lpuede dividir entre0
        this.errores.capturaExpresiones("No se puede obtener residuio 0", valor2+"")
        result = 0
    }else{
        if (valor1) {
            result = 1 % valor2
        }else {
            result  = 0
        }
    }
    return result
  }

  private modNumber(valor1: number, valor2: any): any{
    let result
    if ("boolean" == typeof valor2) {
        result = this.modNumberBoo(valor1, valor2)
    } else if ("number" == typeof valor2) {
        if (valor2 != 0) {
            result = valor1 % valor2
        }else{

            this.errores.capturaExpresiones("No se puede obtener residuio 0", valor2+"")
            result = 0
        }
    }else if ("string" == typeof valor2&& valor2.length == 1) {
        result = valor1 % valor2.charCodeAt(0);
    }else{
  
        this.errores.capturaExpresiones("No se puede obtener residuo de un numero entre string", valor2+"")

        result = 0
    }

    return result
  }

  private modNumberBoo(valor1: number, valor2: boolean): number{
    if (valor2) {
        return valor1 % 1
    }else{

        this.errores.capturaExpresiones("No se puede dividir entre boolena", valor2+"")
        return 0
    }
  }

  private modChar(valor1: String, valor2: any): any{
      let result
    if ("boolean" == typeof valor2) {

        this.errores.capturaExpresiones("no se puede obtener el residuo entre char y boolean", valor2+"")
        result = 0
    }else if ("number" == typeof valor2) {
        if (valor2 != 0) {
            result  = valor1.charCodeAt(0) % valor2
        } else {

            this.errores.capturaExpresiones("No se puede obtener el residuio entre 0", valor2+"")
            result = 0
        }
    } else if ("string" == typeof valor2 && valor2.length == 1) {
        result  = valor1.charCodeAt(0) % valor2.charCodeAt(0)
    } else {
 
        this.errores.capturaExpresiones("No se puede obtener el residuio entre string", valor2+"")

    }
    return result
  }

  private potenciaBoolean(valor1: boolean, valor2: any): any{
    let resutl
    if ("boolean" == typeof valor2) {

        this.errores.capturaExpresiones("No se puede elevar booleans", valor2+"")
        resutl = 0
    } else if("number" == typeof valor2) {
        resutl = this.portenciaBoolNumer(valor1, valor2)
    } else {
   
       this.errores.capturaExpresiones("No se puede elevar booleans ,char y string", valor2+"")
       resutl = 0 
    }
    return resutl
  }

  private portenciaBoolNumer(valor1: boolean, valor2: number): number{
      let result
        if (valor1) {
            result = Math.pow(1,valor2)
        } else {
            result = Math.pow(0,valor2)
        }
      return result

  }

  private potenciaChar(valor1: string, valor2: any): any{
      let resultado
    if ("boolean" == typeof valor2) {
   
        this.errores.capturaExpresiones("No se puede elevar char y boolean", valor2+"")
        resultado = 0
    }else if ("number" == typeof valor2) { 
        resultado = Math.pow(valor1.charCodeAt(0), valor2)
    } else if("string" == typeof valor2&& valor2.length == 1) {
        resultado = Math.pow(valor1.charCodeAt(0), valor2.charCodeAt(0))
    }else{

        this.errores.capturaExpresiones("No se puede elevar char y string", valor2+"")
        resultado = 0
    }

    return resultado
  }

  private potenciaNumber(valor1: number, valor2: any): number{
    let resultado
    if ("boolean" == typeof valor2) {
        resultado = this.potenciaNumberBoole(valor1, valor2)
    }else if ("number" == typeof valor2) {
        resultado = Math.pow(valor1, valor2)
    } else if("string" == typeof valor2 && valor2.length == 1){
        resultado = Math.pow(valor1, valor2.charCodeAt(0))
    }else{
  
        this.errores.capturaExpresiones("No se puede elevar un numero con string", valor2+"")
        resultado = 0
    }

    return resultado
  }

  private potenciaNumberBoole(valor1: number, valor2: boolean): number{
    if (valor2) {
        return Math.pow(valor1, 1)
    } else {
        return 1
    }
  }
}
