import React, { Component } from "react";
import axios from 'axios';
import "./Logging.css";

class Logging extends Component {
    state = {
        user: "",
        email: "",
        password1: "",
        password2: "",
        logemail: "",
        logpassword: "",
        isAuthenticated: false
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    clearHandler = () => {
        this.setState({
            user: "",
            email: "",
            password1: "",
            password2: ""
        });
    };

    handleFormSubmit = event => {
        // Preventing the default behavior of the form submit (which is to refresh the page)
        event.preventDefault();
        axios.post("http://whatcook.herokuapp.com/login", { user: this.state.user, email: this.state.email, password: this.state.password1, passwordConf: this.state.password2 })
            .then(res => {
                if (res.status === "error") {
                    throw new Error(res.data.message);
                }
                // Tell the UI we've authenticated.
                localStorage.setItem("userID", res.data._id)
                // React redirect to /home route.
                this.props.history.push("/Home");
            })
            .catch(err => this.setState({ error: err.message }));

        this.setState({
            user: "",
            email: "",
            password1: "",
            password2: ""
        });
    };

    handleSginInSubmit = event => {
        // Preventing the default behavior of the form submit (which is to refresh the page)
        event.preventDefault();
        axios.post("http://whatcook.herokuapp.com/login", { logemail: this.state.logemail, logpassword: this.state.logpassword })
            .then(res => {
                // This tells the UI we've authenticated. See fakeAuth.js
                localStorage.setItem("userID", res.data._id)
                if (res.status === "error") {
                    throw new Error(res.data.message);
                }
                // React redirect to /Home route.
                this.props.history.push("/Home");
            })
            .catch(err => this.setState({
                ...this.state,
                error: err.message
            }));
        this.setState({
            ...this.state,
            logpassword: "",
            logemail: "",
        });
    };

    render() {
        return (
            <div className="Logging">
                <h1 className="Header">What To Cook?</h1>
                <div className="row" style={{ justifyContent: 'space-evenly' }}>
                    <div className="Col-md-6">
                        <form onSubmit={this.handleFormSubmit}>
                            <h3>Sign Up</h3>
                            <div className="form-group">
                                <label htmlFor="user" style={{ display: 'flex' }}>Full Name</label>
                                <input
                                    type="text"
                                    onChange={this.handleInputChange}
                                    value={this.state.user}
                                    placeholder="Name"
                                    id="user"
                                    name="user"
                                    className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" style={{ display: 'flex' }}>Email address</label>
                                <input
                                    type="email"
                                    onChange={this.handleInputChange}
                                    value={this.state.email}
                                    placeholder="Email"
                                    id="email"
                                    name="email"
                                    className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password1" style={{ display: 'flex' }}>Password</label>
                                <input
                                    type="password"
                                    onChange={this.handleInputChange}
                                    value={this.state.password1}
                                    placeholder="Password"
                                    id="password1"
                                    name="password1"
                                    className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password2" style={{ display: 'flex' }}>RE-Password</label>
                                <input
                                    type="password"
                                    onChange={this.handleInputChange}
                                    value={this.state.password2}
                                    placeholder="RE-Password"
                                    id="password2"
                                    name="password2"
                                    className="form-control" />
                            </div>
                            <button className="btn danger" onClick={this.clearHandler}>Clear</button>
                            <button type="submit" className="btn warning ml-2">Sign Up</button>
                        </form>
                    </div>
                    <div className="Col-md-6">
                        <form onSubmit={this.handleSginInSubmit}>
                            <h3>Sign In</h3>
                            <div className="form-group">
                                <label htmlFor="logemail" style={{ display: 'flex' }}>Email address</label>
                                <input
                                    onChange={this.handleInputChange}
                                    value={this.state.logemail}
                                    icon="envelope"
                                    id="logemail"
                                    type="email"
                                    name="logemail" className="form-control" aria-describedby="emailHelp" placeholder="Enter email" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="logpassword" style={{ display: 'flex' }}>Password</label>
                                <input
                                    onChange={this.handleInputChange}
                                    value={this.state.logpassword}
                                    icon="lock"
                                    type="password"
                                    name="logpassword" className="form-control" id="logpassword" placeholder="Password" />
                            </div>
                            <button type="submit" className="btn primary">Sign In</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Logging;