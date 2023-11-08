import React, { useState, useEffect } from "react"
import { AgGridReact } from 'ag-grid-react'
import { Button } from "@mui/material"
import { Snackbar } from "@mui/material"
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-material.css'
import Addcar from "./Addcar"
import Editcar from "./Editcar"

export default function Carlist() {

    // State variables
    const [cars, setCars] = useState([])
    const [msg, setMsg] = useState('')
    const [open, setOpen] = useState(false)

    // Call getCars() function when rendering the component for the very first time
    useEffect(() => getCars(), [])

    const REST_URL = "https://carrestapi.herokuapp.com/cars"

    const getCars = () => {
        fetch(REST_URL)
            .then(response => response.json())
            .then(responseData => {
                setCars(responseData._embedded.cars)
            })
            .catch(error => console.error(error))
    }

    // Functions
    const deleteCar = (carToDelete) => {
        fetch(carToDelete.data._links.car.href, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setMsg('Car was deleted successfully!')
                    setOpen(true)
                    getCars()
                } else {
                    alert('Something went wrong')
                }
            })
            .catch(error => console.error(error))
    }

    const updateCar = (editedCar, carToEdit) => {
        fetch(carToEdit, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedCar)
        })
            .then(response => getCars())
            .catch(error => console.error(error))
    }

    const saveCar = (newCar) => {
        fetch(REST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCar)
        })
            .then(response => getCars())
            .catch(error => console.error(error))
    }

    // Columns for cars ag-grid
    const columns = [
        { field: 'brand' },
        { field: 'model' },
        { field: 'color' },
        { field: 'fuel' },
        { field: 'year' },
        { field: 'price' },
        {
            cellRenderer: carToEdit =>
                <Editcar updateCar={updateCar} carToEdit={carToEdit.data} />,
            width: 120
        },
        {
            cellRenderer: carToDelete =>
                <Button size="small" color="error" onClick={() => deleteCar(carToDelete)}>
                    Delete
                </Button>,
            width: 120
        }
    ]

    return (
        <>
            <Addcar saveCar={saveCar} />
            <div className="ag-theme-material"
                style={{ height: '700px', width: '100%', margin: 'auto' }}>
                <AgGridReact
                    rowData={cars}
                    columnDefs={columns}
                    pagination={true}
                    paginationPageSize={10}
                />
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={() => setOpen(false)}
                    message={msg}
                />
            </div>
        </>
    )

}