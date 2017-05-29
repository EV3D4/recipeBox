import React, { Component } from 'react';
import './App.css';


class RecipeBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      repo: [{
        title: "cappuccino",
        ingredients: ["milk", "sugar", "coffee", "water"]
      }, {
        title: "latte",
        ingredients: ["water", "sugar", "coffee"]
      }, {
        title: "tea",
        ingredients: ["water", "milk", "tea"]
      }],
      showAddPrompt: false,
      showEditPrompt: false,
      editRecipe: [],
      editRecipeID: 0
    };

    this.addNewRecipeButton = this.addNewRecipeButton.bind(this);
    this.cancelNewRecipe = this.cancelNewRecipe.bind(this);
    this.saveNewRecipe = this.saveNewRecipe.bind(this);
    this.openRecipe = this.openRecipe.bind(this);
    this.saveEditRecipe = this.saveEditRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

  addNewRecipeButton() {
    if (this.state.showAddPrompt === false) {
      this.setState({
        showAddPrompt: !this.state.showAddPrompt
      })
    }

  }

  cancelNewRecipe() {
    if (this.state.showAddPrompt === true) {
      this.setState({
        showAddPrompt: !this.state.showAddPrompt
      })
    }

    if (this.state.showEditPrompt === true) {
      this.setState({
        showEditPrompt: !this.state.showEditPrompt
      })
    }

  }

  saveNewRecipe(x, y) {

    if (x !== "name" && y !== "ingredients") {
      var arrayvar = this.state.repo.slice()
      arrayvar.push({
          title: x,
        ingredients: y.split(',')

      })

      this.setState({
        repo: arrayvar
      })
    } {
      this.cancelNewRecipe()
    }

    localStorage.setItem('_kalpitp_recipes', JSON.stringify(arrayvar));
  }

  openRecipe(event) {


    const {
      id
    } = event.target;

    if (this.state.showAddPrompt === false) {
      this.setState({
        showEditPrompt: !this.state.showEditPrompt
      })
    }

    this.setState({
      editRecipe: this.state.repo[id],
      editRecipeID: id
    })

  }

  saveEditRecipe(x, y) {

    var arrayvar = this.state.repo.slice()

    arrayvar.splice(this.state.editRecipeID, 1, {
      title: x,
      ingredients: y
    })

    this.setState({
      repo: arrayvar
    })

    {
      this.cancelNewRecipe()
    }

    localStorage.setItem('_kalpitp_recipes', JSON.stringify(arrayvar));

  }

  deleteRecipe() {

    var arrayvar = this.state.repo.slice()

    arrayvar.splice(this.state.editRecipeID, 1)

    this.setState({
      repo: arrayvar
    })

    this.cancelNewRecipe()

    localStorage.setItem('_kalpitp_recipes', JSON.stringify(arrayvar));

  }

  componentDidMount  () {
      var initRecipe=[];

    if (typeof(localStorage._kalpitp_recipes) != "undefined") {

    var temp= JSON.parse(localStorage.getItem('_kalpitp_recipes'))

      for (var i=0;i<temp.length;i++)
      {
        initRecipe[i]={title:temp[i].title,ingredients:temp[i].ingredients}
      }
      this.setState({
        repo: initRecipe

      })

    }
    console.log(initRecipe)
  }



  render() {


    return (
      <div className="viewController">
        <div className="title">recipeBox</div>
        <div className="recipeDrawer">
        <RecipeIndex repo={this.state.repo} openRecipe={this.openRecipe}/>
         <button className="addButton" onClick={this.addNewRecipeButton}> add </button>
            {this.state.showAddPrompt ? <AddPrompt cancelNewRecipe={this.cancelNewRecipe} saveNewRecipe={this.saveNewRecipe}/> : null}
            {this.state.showEditPrompt ? <EditPrompt cancelNewRecipe={this.cancelNewRecipe} editRecipe={this.state.editRecipe} deleteRecipe={this.deleteRecipe} saveEditRecipe={this.saveEditRecipe}/> : null}
        </div>
      </div>
    );
  };
}

class RecipeIndex extends React.Component {

  render() {
    var recipeNodes = [];
    var iterate = this.props.repo.length;
    if (this.props.repo.length > 0) {
      for (var i = 0; i < iterate; i++) {
        recipeNodes.push(
          <div className="recipeIndex" >
            <a href="#" id={i} onClick={this.props.openRecipe}>{this.props.repo[i].title}</a>
          </div>)
      }
    }

    return (
      <div className="recipeView">
        {recipeNodes}
        <div>
        </div>
      </div>
    );
  }
}

class AddPrompt extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'name',
      ingredients: 'ingredients'
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    event.preventDefault();

  }

  render() {

    return (
      <div className="inputPrompt">
        <div className="closePrompt"><a href="#" onClick={this.props.cancelNewRecipe}>X</a>
        </div>
            <div className="inputRecipeName">
              <textarea id="recipeName" name="name" value={this.state.name} onChange={this.handleChange}/>
            </div>
              <div className="inputRecipeIngredients">
                <textarea id="recipeIngredients" name="ingredients" value={this.state.ingredients} onChange={this.handleChange}/>
              </div>
            <button className="saveButton" onClick={()=>this.props.saveNewRecipe(this.state.name, this.state.ingredients)}>save</button>
          </div>
    );
  }
}

class EditPrompt extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.editRecipe.title,
      ingredients: this.props.editRecipe.ingredients
    };
    this.handleEditChange = this.handleEditChange.bind(this);
  }

  handleEditChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    event.preventDefault();

  }

  render() {

    return (
      <div className="inputPrompt">
        <div className="closePrompt"><a href="#" onClick={this.props.cancelNewRecipe}>X</a>
        </div>
            <div className="inputRecipeName">
              <textarea id="recipeName" name="name" value={this.state.name} onChange={this.handleEditChange}/>
            </div>
              <div className="inputRecipeIngredients">
                <textarea id="recipeIngredients" name="ingredients" value={this.state.ingredients} onChange={this.handleEditChange}/>
              </div>
            <button className="deleteButton" onClick={this.props.deleteRecipe}>delete</button>
            <button className="saveEditButton" onClick={()=>this.props.saveEditRecipe(this.state.name, this.state.ingredients)}>save</button>
          </div>
    );
  }
}





export default RecipeBox;
