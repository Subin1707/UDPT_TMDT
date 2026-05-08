package com.example.servingwebcontent.Controllers;
import java.util.ArrayList;

import com.example.servingwebcontent.Model.User;

public class ListUser {
    public void printListUser(ArrayList<User> listUser){
        for(int i =0; i<listUser.size(); i++){
            System.out.println("List user:");
            System.out.println(listUser.get(i).userName);
            System.out.println(listUser.get(i).address);
            System.out.println(listUser.get(i).userID);


        }
    }
    
}
