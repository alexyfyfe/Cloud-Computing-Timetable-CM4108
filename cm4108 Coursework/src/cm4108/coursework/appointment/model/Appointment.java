package cm4108.coursework.appointment.model;

import com.amazonaws.services.dynamodbv2.datamodeling.*;

import cm4108.coursework.config.*;

@DynamoDBTable(tableName=Config.DYNAMODB_TABLE_NAME)
public class Appointment
{
private  String id;				//This String value identifies an appointment.
private  long dateTime;			//The date and time of the appointment as the number of milliseconds since 01/01/1970.
private  long duration;			//The duration of the appointment in minutes.
private  String owner;			//The owner of the appointment.
private  String description;	//The description of the appointment.

public Appointment()
{
} //end method

public Appointment(long dateTime,long duration,String owner,String description)
{
this.setDateTime(dateTime);
this.setDuration(duration);
this.setOwner(owner);
this.setDescription(description);
} //end method

@DynamoDBHashKey(attributeName="id")
@DynamoDBAutoGeneratedKey
public String getId() {
	return id;
} //end method

public void setId(String id) {
	this.id = id;
} //end method

@DynamoDBAttribute(attributeName="dateTime")
public long getDateTime() {
	return dateTime;
} //end method

public void setDateTime(long dateTime) {
	this.dateTime = dateTime;
} //end method

@DynamoDBAttribute(attributeName="duration")
public long getDuration() {
	return duration;
} //end method

public void setDuration(long duration) {
	this.duration = duration;
} //end method

@DynamoDBAttribute(attributeName="owner")
public String getOwner() {
	return owner;
} //end method

public void setOwner(String owner) {
	this.owner = owner;
} //end method

@DynamoDBAttribute(attributeName="description")
public String getDescription() {
	return description;
} //end method

public void setDescription(String description) {
	this.description = description;
} //end method
} //end class
