package com.example.servingwebcontent.Controllers;

import java.util.ArrayList;

import com.example.servingwebcontent.Model.User;

public class AddUserToList {
        public  ArrayList<User> addUserToList(User u){
        ArrayList<User> al = new ArrayList<User>();
        al.add(u);
        return al;
       
    }
  
}
