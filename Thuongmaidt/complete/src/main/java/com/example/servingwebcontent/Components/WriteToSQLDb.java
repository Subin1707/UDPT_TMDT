package com.example.servingwebcontent.Components;
import com.example.servingwebcontent.Model.User;
import com.example.servingwebcontent.database.insertToAiven;



public class WriteToSQLDb {
    public void writeToDb(User u){
        insertToAiven ac = new insertToAiven();
		ac.insertToAivenDb(u);
    }
    
}
