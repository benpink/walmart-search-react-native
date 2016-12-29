/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;
var Router = require('react-native-router');

var ItemPage = React.createClass({
  render: function() {
    return (
      <View style={styles.itemContainer}>
        <Image
          source={{uri: this.props.data.thumbnailImage}}
          style={styles.thumbnail}
        />
        <Text style={styles.title}>{this.props.data.name}</Text>
        <Text style={styles.price}>${this.props.data.salePrice}</Text>
      </View>
    )
  }
})

var SearchResults = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      searching: false
    };
  },

  componentDidMount: function() {
    // this._fetchData();
  },

  render: function() {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            borderBottomColor: '#bbb',
            borderBottomWidth: 1,
          }}>
          <TextInput
            style={{
              height: 50,
              textAlign: 'center',
            }}
            placeholder="Search items"
            onEndEditing={this._fetchItems}
          />
        </View>
        {this._renderSearching()}
        <View style={styles.itemsContainer}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderItem}
            style={styles.listView} />
        </View>
      </View>
    );
  },

  _renderSearching: function() {
    if (this.state.searching) {
      return (
        <Text
          style={{
            textAlign: 'center',
            padding: 20,
          }}>
          Searching
        </Text>
      );
    } else {
      return null;
    }
  },

  _fetchItems: function(event) {
    var SEARCHTERM = event.nativeEvent.text;
    var API_KEY = 'a25dnewg5yrpqpzuvhq3jk97';
    var API_URL = 'http://api.walmartlabs.com/v1/search';
    var PAGE_SIZE = 20;
    var PARAMS = '?numItems=20&format=json&query=' + SEARCHTERM + '&apiKey=' + API_KEY + '&numItems=' + PAGE_SIZE;
    var REQUEST_URL = API_URL + PARAMS;

    this.setState({
      searching: true
    });
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.items),
          searching: false,
        });
      })
      .done();
  },

  _renderItem: function(item) {
    return (
      <TouchableHighlight
        underlayColor="opaque"
        onPress={() => this._handleClick(item)}
      >
        <View style={styles.itemsContainer}>
            <Image
              source={{uri: item.thumbnailImage}}
              style={styles.thumbnail}
            />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.price}>${item.salePrice}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },

  _handleClick: function(item) {
    this.props.toRoute({
      name: "Search Results",
      component: ItemPage,
      data: item
    });
  },
});

var firstRoute = {
  name: 'Walmart-Search',
  component: SearchResults,
};

var walkboard = React.createClass({
  render() {
    return (
      <Router
        firstRoute={firstRoute}
      />
    );
  },
});



var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listView: {
    backgroundColor: '#F5FCFF',
  },
  itemsContainer: {
    flex: 1,
    margin: 5,
    flexDirection: 'row',
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333'
  },
  price: {
    fontSize: 11,
    color: '#666'
  },
  thumbnail: {
    width: 53,
    height: 81,
    marginRight: 10,
    borderRadius: 5
  },


  itemContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#eee'
  },
});

AppRegistry.registerComponent('walkboard', () => walkboard);
