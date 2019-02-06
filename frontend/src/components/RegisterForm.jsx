/*
 * This will be the main component for the registration form. There are two 
 * steps:
 *    1. Provide a username and password (and confirm password). 
 *       Here we will need to check that the username is unique from the database and that
 *       the password is complex enough. 
 * 
 *    2. Provide personal information such as email, location, bio, security question/answer. 
 * This will be done using the RegisterFormAccount and RegisterFormDetails components,
 * respectively.
 */

import React, { Component } from 'react'
import RegisterFormAccount from './RegisterFormAccount'
import RegisterFormDetails from './RegisterFormDetails'

export class RegisterForm extends Component {
  state = {
    step: 1,
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    securityQuestionID: -1,
    securityAnswer: ''
  }

  // Advance to the next form step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    })
  }

  // Return to the previous form step
  prevStep = () => {
    const { step } = this.state;
    if (step > 1) {
      this.setState({
        step: step - 1
      })
    }
  }

  // Handle fields change
  handleChange = input => e => {
    this.setState({[input]: e.target.value});
  }

  render() {
    const { step } = this.state;
    const {
      username,
      password,
      confirmPassword,
      firstName, 
      lastName, 
      emailAddress, 
      securityQuestionID,
      securityAnswer
    } = this.state;
    const values = {
      username,
      password,
      confirmPassword,
      firstName, 
      lastName, 
      emailAddress, 
      securityQuestionID,
      securityAnswer
    }

    switch (step) {
      case 1:
      // Returning the RegisterFormAccount component 
      return (
        <RegisterFormAccount
        nextStep = { this.nextStep }
        handleChange = { this.handleChange }
        values = { values }
        />
      )

      case 2: 
      // Returning the RegisterFormDetails component
      return  (
        <RegisterFormDetails
          // Pass in props here 
        />
      )
    }
  }
}

export default RegisterForm
