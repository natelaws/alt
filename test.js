var Fux = require('./fux')

var fux = new Fux()

var myUtils = {
  callServer(query, cb) {
    setTimeout(function () {
      cb('xhr-' + query)
    }, 500)
  }
}

var myActions = fux.createActions(class MyActions {
  updateName(name) {
    this.dispatch(name)
  }

  save(state) {
    // XXX db call that saves state
    console.log('Saving', state)
  }

  updateFoo(a, b) {
    this.dispatch({ a, b })
  }
})

var myStore = fux.createStore(class MyStore {
  constructor() {
    this.listenTo(myActions.updateName, this.onUpdateName)
    this.name = 'lol'
  }

  onUpdateName(name) {
    this.name = name
  }
})

var secondStore = fux.createStore(class SecondStore {
  constructor() {
    this.foo = 'bar'
    this.name = myStore.getState().name
    this.listenToActions(myActions)
  }

  onUpdateFoo(x) {
    this.foo = x.a + x.b
  }

  onUpdateName() {
    this.waitFor(myStore.dispatchToken)
    console.log('when am i called?', myStore.getState())
    this.name = myStore.getState().name
  }
})

//secondStore.listen(() => {
//  console.log('changed second', secondStore.getState())
//})
//
console.log('Current State:', myStore.getState())

myStore.listen((...args) => {
  console.log('Args', args)
  console.log('Changed State:', myStore.getState())
  console.log('Snapshot of entire app state:', fux.takeSnapshot())
})

//secondStore.listen(() => {
//  console.log('Registering another store')
//})

//var snapshot = '{"myStore":{"name":"hello"},"secondStore":{"yes": true}}'

//fux.bootstrap(snapshot)
//console.log(secondStore.getState())

myActions.updateName('hello')
//myActions.updateFoo(1, 2)
