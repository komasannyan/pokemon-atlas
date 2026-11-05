// Load the large Legends: Z-A guide module on first use, instead of importing it with the app.
// Concurrent callers share one load. Failed loads can be retried without reloading the page.
export function createLazyGuides({options,load=()=>import('./guides-v09.js'),onStatus=()=>{}}={}){
  let module=null, pending=null, pendingTab=null;
  function report(status){try{onStatus(status);}catch(error){console.warn('Guide status callback failed',error);}}
  function ensure(){
    if(module)return Promise.resolve(module);
    if(!pending){
      report('loading');
      pending=Promise.resolve().then(load).then(loaded=>{
        if(!loaded||typeof loaded.setupGuides!=='function')throw new TypeError('Invalid guide module');
        loaded.setupGuides(options);
        module=loaded;
        if(pendingTab){
          const [tab,game]=pendingTab;
          pendingTab=null;
          module.openGuideTab(tab,game);
        }
        report('ready');
        return module;
      }).catch(error=>{
        pending=null;
        report('error');
        throw error;
      });
    }
    return pending;
  }
  return {
    ensure,
    isLoaded:()=>Boolean(module),
    show(){
      if(module){module.refreshGuides();return Promise.resolve(module);}
      return ensure().catch(()=>null);
    },
    refresh(){if(module)module.refreshGuides();},
    openTab(tab,game){
      if(module){module.openGuideTab(tab,game);return;}
      pendingTab=[tab,game];
      ensure().catch(()=>{});
    }
  };
}
