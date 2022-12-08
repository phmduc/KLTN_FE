import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

export const categorySlice = createSlice({
    name:"category",
    initialState:{
        cate:[
        ],
    },
    reducers:{
        getAllCategory: (state, action) => {
            state.category=action.payload;
        },
        addCategory: (state, action) => {
            state.category=[...state.category, action.payload];
        },
        deleteCategory:(state, action)=>{
            state.category.forEach((item, index)=>{
                if(item.ID === action.payload.ID){
                    state.category.splice(index,1)
                }
            })
        },
        updateCategory:(state, action)=>{
            state.category.forEach((item, index)=>{
                if(item.ID === action.payload.ID){
                    item.nameCate=action.payload.nameCate
                    item.avatarCate= action.payload.avatarCate
                }
            })
        },
        // updateProduct:(state, action)=>{
        //     state.products.forEach((item, index)=>{
        //         if(item.ID === action.payload.ID){
        //             item.name=action.payload.ID
        //             item.image=action.payload.image
        //             item.desc=action.payload.desc
        //             item.price=action.payload.price
        //             item.countInStock=action.payload.countInStock
        //         }
        //     })
        // },
        // deleteProduct:(state, action)=>{
        //     state.products.forEach((item, index)=>{
        //         if(item.ID === action.payload.ID){
        //             state.products.splice(index,1)
        //         }
        //     })
        // }
    }
})

export const {getAllCategory, addCategory, deleteCategory, updateCategory} = categorySlice.actions;

export default categorySlice.reducer;   