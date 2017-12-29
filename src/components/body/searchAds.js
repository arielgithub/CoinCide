require('normalize.css/normalize.css');
require('styles/App.css');

import React, { Component } from 'react';
import axios from 'axios';
import { List } from 'react-item-list';
import {
  ListGroup, ListGroupItem, Button, FormGroup, Input,
  Label, Pagination, PaginationItem, PaginationLink
} from 'reactstrap';


class Ads extends Component {
  render() {
    let itemData = this.props.itemData;
    return <ListGroupItem><div>{itemData.id} - {itemData.title} <br /> {itemData.description}
      <Button color="primary">Dettaglio</Button>
    </div></ListGroupItem>
  }
}

class SearchAdsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      adses: {
        list: [],
        pag: 1,
        totPag: 1,
        npe: 10,
        tote: 0,
        paginator: []
      }
    }
  }

  componentDidMount() {
    this.getAdsPag(this.state.adses.pag, this.state.adses.npe);
    this.countElements(this.state.adses.npe);
  }

  getAdsPag(pag, numPerPag) {
    var self = this;
    axios.get('http://localhost:3000/api/ads/getAdsPag', {
      params: {
        pagina: pag,
        numElementPerPage: numPerPag
      }
    })
      .then(res => {
        self.state.adses.list = res.data;
        self.setState(self.adses)
      }).catch((error) => {
        //console.log("error", error) Gestione dei log?
      })
  }


  countElements(numPerPag) {
    var self = this;
    axios.get('http://localhost:3000/api/ads/countAdsPag', {
      params: {
        numElementPerPage: numPerPag
      }
    })
      .then(res => {
        self.state.adses.tote = res.data.total;
        self.state.adses.totPag = res.data.pages;
        self.createPaginator(self.state.adses.totPag);
        self.setState(self.adses)
      }).catch((error) => {
        //console.log("error", error) Gestione dei log?
      })
  }

  createPaginator(totPag){
    var self = this;
    this.state.adses.paginator.push(<PaginationItem><PaginationLink previous href="#" /></PaginationItem>);
    var i;
    for(i = 1; i<=totPag; i++){
      this.state.adses.paginator.push(<PaginationItem><PaginationLink key={i} onClick={self.changePage.bind(this,i)}>{i}</PaginationLink></PaginationItem>);
    }
    this.state.adses.paginator.push(<PaginationItem><PaginationLink next href="#" /></PaginationItem>);
  }

  changePage(page){
    console.log(page);
    this.getAdsPag(page, this.state.adses.npe);
    this.setState(self.adses);
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <ListGroup>
            <ListGroupItem className="row">Ricerca:
            <FormGroup className="col-md-6">
                <Label for="exampleSelect">Acquisto:</Label>
                <Input type="select" name="select" id="exampleSelect">
                  <option>LTC</option>
                  <option>BTC</option>
                  <option>ETH</option>
                  <option>XRP</option>
                  <option>ADA</option>
                </Input>
              </FormGroup>
              <FormGroup className="col-md-6">
                <Label for="exampleSelect">Vendo:</Label>
                <Input type="select" name="select" id="exampleSelect">
                  <option>LTC</option>
                  <option>BTC</option>
                  <option>ETH</option>
                  <option>XRP</option>
                  <option>ADA</option>
                </Input>
              </FormGroup>
            </ListGroupItem>
            <List items={this.state.adses.list} ListItem={Ads} />
          </ListGroup>
          <Pagination>
            {this.state.adses.paginator}
          </Pagination>
        </div>
      </div>
    );
  }
}

SearchAdsComponent.defaultProps = {
};


export default SearchAdsComponent;
