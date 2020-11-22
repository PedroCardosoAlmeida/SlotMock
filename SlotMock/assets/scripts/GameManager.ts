import Tile from "./slots/Tile";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property(cc.Node)
  machine = null;
  

  @property({ type: cc.AudioClip })
  audioClick = null;

  private block = false;

  private result = null;

 

  start(): void {
    this.machine.getComponent('Machine').createMachine();
    
  }

  update(): void {
    if (this.block && this.result != null) {
      this.informStop();
      this.result = null;
    }
  }

  click(): void {
    cc.audioEngine.playEffect(this.audioClick, false);
    

    if (this.machine.getComponent('Machine').spinning === false) {
      this.block = false;
      this.machine.getComponent('Machine').spin();
      this.requestResult();
    } else if (!this.block) {
      this.block = true;
      this.machine.getComponent('Machine').lock();
    }
  }

  async requestResult(): Promise<void> {
    this.result = null;
    this.result = await this.getAnswer();
  }

  getAnswer(): Promise<Array<Array<number>>> {
    const slotResult = this.getChance(); 
    return new Promise<Array<Array<number>>>(resolve => {
      setTimeout(() => {
        resolve(slotResult);
      }, 1000 + 500 * Math.random());
    });
  }
  
  getChance(): Array<Array<number>>{ // Função para pegar o comportamento baseado numa porcentagem
     var chance = Math.random()
     var tile = Math.floor(Math.random() * 30);
     var lines = Math.floor(Math.random() * 3) + 1; 
     if (chance < 0.5) // 50%
     {
           return this.getResult(0,-1,-1);
     }
     else if(chance < 0.83) // 33%
     {
          return this.getResult(1,tile,lines);
     }
     else if(chance < 0.93) // 10%
     {
         return this.getResult(2,tile,lines);
     }
     else // 7%
     {
       return this.getResult(3,tile,lines);
     }

  }

  getResult(behavior,tile,lines): Array<Array<number>>{ // Função para retornar os resultados da máquina baseado na porcentagem
     
    switch(behavior){
      case 0: // Retorna tiles aleatórios.
      {
        return []; 
      }
      case 1: // Retorna uma linha com tiles iguais.
       {
          if(lines == 1)
          {
            return [[tile],[tile,-1,-1],[tile],[tile,-1,-1],[tile]]; // Linha do topo.
          }
          else if(lines == 2)
          {
            return [[-1,tile,-1],[-1,tile,-1],[-1,tile,-1],[,-1,tile,-1],[-1,tile,-1]]; // Linha do meio.
          }
          else
          {
            return [[-1,-1,tile],[tile],[-1,-1,tile],[tile],[-1,-1,tile]]; // Linha do fundo.
          }
      }
      case 2: // retorna duas linhas com tiles iguais.
      {
        if(lines == 1)
        {
          return [[tile,tile,-1],[tile,tile,-1],[tile,tile,-1],[tile,tile,-1],[tile,tile,-1]]; // Linhas do topo e do meio.
        }
        else if(lines == 2)
        {
          return [[-1,tile,tile],[-1,tile,tile],[-1,tile,tile],[-1,tile,tile],[-1,tile,tile]]; // Linhas do meio e do fundo.
        }
        else
        {
          return [[tile,-1,tile],[tile,-1,tile],[tile,-1,tile],[tile,-1,tile],[tile,-1,tile]]; // Linhas do topo e do fundo.
        }
      }
      case 3: // retorna todas as linhas com tiles iguais.
      {
        return [[tile,tile,tile],[tile,tile,tile],[tile,tile,tile],[tile,tile,tile],[tile,tile,tile]]; // todas as linhas.
      }

    }
    
  }


  informStop(): void {
   
    const resultRelayed = this.result;
    this.machine.getComponent('Machine').stop(resultRelayed);
  }
}
