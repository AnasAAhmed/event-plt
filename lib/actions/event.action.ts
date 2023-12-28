"use server";
import {  
  CreateEventParams,  
  DeleteEventParams,  
  GetAllEventsParams,  
  GetEventsByUserParams,  
  GetRelatedEventsByCategoryParams,  
  UpdateEventParams } from "@/type";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Event from "../database/modals/event.model";
import User from "../database/modals/user.modal";
import Category from "../database/modals/category.model";
import { revalidatePath } from "next/cache";



const populateEvent = async (query:any) =>{  
  return query
  .populate({path:'organizer' , model:User ,select:'_id firstName lastName' })
  .populate({path:'category' , model:Category ,select:'_id name' })
}
//create event
export const createEvent = async ({ userId, event, path }: CreateEventParams) => {
  try {
    await connectToDatabase()

    const organizer = await User.findById(userId)
    if (!organizer){throw new Error('Organizer not found')}


    const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId })


    return JSON.parse(JSON.stringify(newEvent))
  } catch (error) {
    handleError(error)
  }
}
// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase()

    const eventToUpdate = await Event.findById(event._id)
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    handleError(error)
  }
}
// get event by id
export const getEventById = async (eventId: string) => {
  try {
    await connectToDatabase();

    const event = await populateEvent(Event.findById(eventId));
    
    if (!event){throw new Error('Event not found');}

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
}
// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    await connectToDatabase()

    const conditions = { organizer: userId }
    const skipAmount = (page - 1) * limit

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
export const getAllEvents = async ({query,limit = 6 ,page,category}:GetAllEventsParams) => {
  try {
    await connectToDatabase();

 const conditions = {};

    const eventsQuery = Event.find(conditions)
    .sort({createdAt :"desc"})
    .skip(0)
    .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions)

    return { 
      data:JSON.parse(JSON.stringify(events)) ,
      totalPages : Math.ceil(eventsCount / limit)
    }
  } catch (error) {
    handleError(error);
  }
}
//delete
export const deleteEvent = async ({eventId,path}:DeleteEventParams) => {
  try {
    await connectToDatabase();

    const deleteEvent = await Event.findByIdAndDelete(eventId);
    
    if (!deleteEvent) revalidatePath(path);

  } catch (error) {
    handleError(error);
  }
}
// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}




