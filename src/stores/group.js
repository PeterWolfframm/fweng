import { defineStore } from "pinia"
import {ref} from 'vue'

export const useGroupStore = defineStore('group', () => {
    const groups = ref([
        { id: 1, name: 'Tech Enthusiasts', icon: '💻', description: 'A group for people who love technology, gadgets, and innovation.' },
        { id: 2, name: 'Cooking Lovers', icon: '🍳', description: 'A group for foodies and those who love experimenting in the kitchen.' },
        { id: 3, name: 'Soccer Lovers', icon: '⚽', description: 'A group for soccer lovers.' }
    ])


    const currentUser = ref(null)

    if(!currentUser.value){
        currentUser.value = {
            username: 'testUser',
            role: 'USER',
        }
    }

    function createGroup(name, description){
        const newGroup = {
            id: Date.now().toString(),
            name, 
            description,
            members: [currentUser.value.username],
            posts: [],
        }
        groups.value.push(newGroup)
    }

    //join group
    function joinGroup(groupId){
        const group = groups.value.find(g => g.id === groupId)
        if(group && !group.members.includes(currentUser.value.username)){
            group.posts.push(currentUser.value.username)
        }
    }

    //add posts to group
    function addPostToGroup(groupId, post){
        const group = groups.value.find(g => g.id === groupId)
        if(group && (group.members.includes(currentUser.value.username) || currentUser.value.role === 'ADMIN')){
            group.posts.push(post)
        } else{
            throw new Error('You must be a member of the group to post.')
        }
    }

    function deleteGroup(groupId){
        const groupIndex = groups.value.findIndex(g => g.id === groupId)
        if(currentUser.value.role === 'ADMIN'){
            groups.value.splice(groupIndex, 1)
        }
    }

    return{
        groups,
        currentUser,
        createGroup,
        joinGroup,
        addPostToGroup,
        deleteGroup,
    }
})