package cm4108.coursework.appointment.resource;

//general Java
import java.util.*;
//JAX-RS

import javax.ws.rs.*;
import javax.ws.rs.core.*;

import com.amazonaws.regions.Regions;
//AWS SDK
import com.amazonaws.services.dynamodbv2.datamodeling.*;

import cm4108.coursework.aws.util.*;
import cm4108.coursework.appointment.model.*;
import cm4108.coursework.config.Config;


@SuppressWarnings("serial")

@Path("/appointment")
public class AppointmentResource
{
@POST
@Produces(MediaType.TEXT_PLAIN)
public Response addAppointment(	
			@FormParam("dateTime") long dateTime,
			@FormParam("duration") int duration,
			@FormParam("owner") String owner,
			@FormParam("description") String description
		)
{
try	{
	Appointment appointment=new Appointment(dateTime,duration,owner,description);
	DynamoDBMapper mapper=DynamoDBUtil.getMapper(Config.AWS_REGION);
	mapper.save(appointment);
	return Response.status(201).entity("appointment saved").build();
	} catch (Exception e)
		{
		return Response.status(400).entity("error in saving appointment").build();
		}
} //end method


@Path("/{id}")
@GET
@Produces(MediaType.APPLICATION_JSON)
public Appointment getOneAppointment(@PathParam("id") String id)
{
DynamoDBMapper mapper=DynamoDBUtil.getMapper(Config.AWS_REGION);
Appointment appointment=mapper.load(Appointment.class,id);

if (appointment==null) {
	throw new WebApplicationException(404);
}
return appointment;
} //end method


@Path("/{id}")
@POST
@Produces(MediaType.TEXT_PLAIN)
public Response updateAppointment(
			@PathParam("id") String id,
			@FormParam("dateTime") long dateTime,
			@FormParam("duration") int duration,
			@FormParam("owner") String owner,
			@FormParam("description") String description
		)
{
try	{
	DynamoDBMapper mapper=DynamoDBUtil.getMapper(Config.AWS_REGION);
	Appointment appointment=mapper.load(Appointment.class,id);
	//Update appointment values from form
	appointment.setDateTime(dateTime);
	appointment.setDescription(description);
	appointment.setDuration(duration);
	//Save appointment back to DynamoDB
	mapper.save(appointment);
	return Response.status(200).entity("appointment updated").build();
	} catch (Exception e)
		{
		return Response.status(400).entity("error in updating appointment").build();
		}
} //end method


@GET
@Produces(MediaType.APPLICATION_JSON)
public Collection<Appointment> getAllAppointments()
{
DynamoDBMapper mapper=DynamoDBUtil.getMapper(Config.AWS_REGION);	
DynamoDBScanExpression scanExpression=new DynamoDBScanExpression();	//create scan expression
List<Appointment> result=mapper.scan(Appointment.class, scanExpression);			//retrieve all appointments from DynamoDB

if (result==null) {
	throw new WebApplicationException(404);
}
	
return result;
} //end method


@Path("/{id}")
@DELETE
public Response deleteOneAppointment(@PathParam("id") String id)
{
DynamoDBMapper mapper=DynamoDBUtil.getMapper(Config.AWS_REGION);
Appointment appointment=mapper.load(Appointment.class,id);

if (appointment==null) {
	throw new WebApplicationException(404);
}
mapper.delete(appointment);
return Response.status(200).entity("appointment deleted").build();
} //end method

} //end class
