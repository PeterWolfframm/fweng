import { defineStore } from "pinia"
import {ref} from 'vue'

    function loadGroups(){
        const groups = localStorage.getItem("groups");
        return groups ? JSON.parse(groups) : [];
    }

    export const useGroupStore = defineStore('group', () => {
        const groups = ref(loadGroups());


    const currentUser = ref(null);

    function createGroup(name, description){
        if (!currentUser.value) {
      throw new Error('User not logged in!');
    }

        const newGroup = {
            id: Date.now().toString(),
            name, 
            icon: '🔗',
            description,
            members: [currentUser.value.username],
            posts: [],
        }
        groups.value.push(newGroup);
        localStorage.setItem("groups", JSON.stringify(groups.value));
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