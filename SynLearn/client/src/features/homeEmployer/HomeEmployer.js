import React from 'react';
import "./HomeEmployer.css";
import Search from "./search/Search";
import Dashboard from "./dashboard/Dashboard";
import Result from "./result/Result";
import {useSelector} from "react-redux";
import {selectDashboard} from "./homeEmployerSlice";

function HomeEmployer() {

    const dashboard = useSelector(selectDashboard);

    return (
        <div className="homeEmployer">
            <Search />
            { dashboard ? dashboard.length !== 0 ? <Dashboard /> : "" : "" }
            <Result />
        </div>
    );
}

export default HomeEmployer;