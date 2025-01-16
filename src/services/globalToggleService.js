let globalToggleValue = false;
export default class GlobalToggleService{
    static getToggleValue(){
        return globalToggleValue;
    }
    static setToggleValue(value){
        globalToggleValue = value;
    }

}