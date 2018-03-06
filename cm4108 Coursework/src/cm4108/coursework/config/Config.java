package cm4108.coursework.config;

import com.amazonaws.regions.Regions;

public class Config
{
//
// table name in DynamoDB
//
public static final String DYNAMODB_TABLE_NAME="cm4108-coursework-appointment";

//
// AWS Region. Refer to API to see what regions are available.
// *** To use a local server, set this to null. ***
//
public static final Regions AWS_REGION=Regions.EU_WEST_1;
} //end class
