import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Gallery from './components/Gallery'
import Home from './components/pages/Home'
import Photo from './components/pages/Photo'
import Artwork from './components/pages/Artwork'
import Design from './components/pages/Design'
import Info from './components/pages/Info'

class App extends Component {
  render() {
    return (
      <Router>
        <Header />
        <main>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/photography" component={Photo} />
            <Route path="/artwork" component={Artwork} />
            <Route path="/designs" component={Design} />
            <Route path="/info" component={Info} />
            <Route path="/gallery" exact component={Gallery} />
            <Route path="*" render={ () => <h1 style={{ textAlign: "center" }}>SORRY, PAGE NOT FOUND</h1> } />
          </Switch>
        </main>
        <Footer />
      </Router>
    );
  }
}

export default App;
