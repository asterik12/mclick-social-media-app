const moment = require('moment')

module.exports = {
    formatDate: function(date, format){
        return moment(date).fromNow()
    },
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
          let new_str = str + ' '
          new_str = str.substr(0, len)
          new_str = str.substr(0, new_str.lastIndexOf(' '))
          new_str = new_str.length > 0 ? new_str : str.substr(0, len)
          return new_str + '...'
        }
        return str
      },

      stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
      },

      getStatus: function (status) {
        if(status == "public")
          return `<i class="material-icons card-date" style="font-size:12px;">
          public
          </i> <span class="card-date"> public </span>`;
        else if(status == "friends")
          return `<i class="material-icons card-date" style="font-size:12px;">
          people
          </i> <span class="card-date"> friends </span>`;
        else
          return `<i class="material-icons card-date" style="font-size:12px;">
          lock
          </i> <span class="card-date"> private </span>`;

      },

      editIcon: function (storyUser, loggedUser, storyId,) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
           
          return `<!-- Dropdown Trigger -->
          <a class='dropdown-trigger btn right' href='#' data-target='post-edit-${storyId}'><i class="material-icons">more_horiz</i></a>

          <!-- Dropdown Structure -->
          <div id='post-edit-${storyId}' class='dropdown-content show'>
              
              <a class="btn" style="margin-bottom:5px" href="/feed/edit/${storyId}"><i class="fas fa-edit fa-small"></i></a>
              
              
                  <form action="/feed/${storyId}" method="POST" id="delete-form">
                      <input type="hidden" name="_method" value="DELETE">
                     
                      
                      <button type="submit" class="btn">
                        <i class="fas fa-trash fa-small"></i> 
                      </button> 
                     
                  </form>
                  
          </div>`
        
      }  else {
          return ''
        }
      },
      editIconfeed: function (storyUser, loggedUser, storyId) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
           
            return `<!-- Dropdown Trigger -->
            <a class='dropdown-trigger btn right' href='#' data-target='post-edit-${storyId}'><i class="material-icons">more_horiz</i></a>

            <!-- Dropdown Structure -->
            <div id='post-edit-${storyId}' class='dropdown-content show'>
                
                <a class="btn" style="margin-bottom:5px" href="/feed/edit/${storyId}"><i class="fas fa-edit fa-small"></i></a>
                
                
                    <form action="/feed/${storyId}" method="POST" id="delete-form">
                        <input type="hidden" name="_method" value="DELETE">
                       
                        
                        <button type="submit" class="btn">
                          <i class="fas fa-trash fa-small"></i> 
                        </button> 
                       
                    </form>
                    
            </div>`
          
        } else {
          return ''
        }
      },
      validUser:function (storyUser, loggedUser) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
          return `/profile`;
        }
        else {
          return `/feed/user/${storyUser._id}`;
        }
      },
      validLikedUser:function (likedId, loggedUser) {
        if (likedId.toString() == loggedUser._id.toString()) {
          return `/profile`;
        }
        else {
          return `/feed/user/${likedId}`;
        }
      },
      validLikedUserTag:function (likes, likesArray, loggedUser) {
        if (likes._id.toString() == loggedUser._id.toString()) {
          return `&nbsp; You `;
        }
        else {
          return ` `;
        }
      },
      validFollowedUser:function (followers, loggedUser) {
      
        if (followers.toString() == loggedUser._id.toString()) {
          return `/profile`;
        }
        else {
          return `/feed/user/${followers}`;
        }
      },
      select: function (selected, options) {
        return options
          .fn(this)
          .replace(
            new RegExp(' value="' + selected + '"'),
            '$& selected="selected"'
          )
          .replace(
            new RegExp('>' + selected + '</option>'),
            ' selected="selected"$&'
          )
      },
      checklength: function (message, length_message) {
            if (message.length>length_message) {     
                return `<p class="notification">${message}</p>`;
            }
            
        },
      validImage: function (image_name) {
          if (image_name) {     
              return `<img src="/uploads/posts/${image_name}" alt="" height="500px" width="100%" />
              `;
          }
          
      },
      validDisplayImage: function (image_name) {
        if (image_name) {     
            return `<img src="/uploads/posts/${image_name}" alt="" height="400px" width="100%" />
            `;
        }
        
    },
      validCoverImage: function (image_name) {
        if (image_name) {     
            return `<img src="/uploads/user/cover/${image_name}" alt="" height="500px" width="100%" />
            `;
        }
        
    },
    validProfileImageStory: function (image_name) {
      if (image_name) {     
          return `<img src="/uploads/user/${image_name}" alt="" height="600px" width="100%" />
          `;
      }
      
    },
      validProfileImage: function (image_name) {
        if (image_name) {     
            return `<img src="/uploads/user/${image_name}" alt="" height="400px" width="100%" />
            `;
        }
        
    },
    validVideo: function (video_name) {
      if (video_name) {     
          return `<video src="/uploads/videos/${video_name}" type=""video/mp4" alt="" height="400px" width="100%" controls/>
          `;
      }
      
  },
      validImageEnlarge: function (image_name) {
        if (image_name) {     
            return `<img src="/uploads/posts/${image_name}" alt="" height="500px" width="100%" />
            `;
        }
        
      },
      TimeStatus: function (image_name) {
        if (image_name) {     
            return `
            <a href = "/uploads/stories/${image_name}"> <img src="/uploads/stories/${image_name}" alt="" class="storiesforall" height="210px" width="200px"  /></a>
            `;
        }

       },

       featured: function (image_name) {
        if (image_name) {     
            return `<img src="/uploads/stories/${image_name}" alt="" height="50px" width="50px" class="featured" />
            `;
        }

       },
       checkLikes: function (likes, length_message) {
        if (likes.length>=length_message) { 
          
            return `
            <ul class="collapsible" style="margin-top:-5px; margin-bottom:-5px">
                    <li>
                    <div class="collapsible-header">${likes.length} likes</div>
                    <div class="collapsible-body"><span>
                    
                    ${likes.firstName}</span></div>
                    </li>
            </ul>
            
            `;

        }
        else{
          return ` Like`;
        }
        
      },
      checkLikedLength: function (likes, loggedUser) {
        // if(likes.length == 1)
        //   return `${likes.length}`;
        // else
        for(let i = 0; i<likes.length; i++){
          if(likes[i]._id.toString() == loggedUser._id.toString()) {
            if(likes.length == 1){
              return ` `;
            }
            else {
              return ` and ${likes.length - 1} others`;

            }
          }
          
        }
          return `&nbsp; ${likes.length}`
      },
      checkComments: function (comment, length_message) {
        if (comment.length>=length_message) { 
          
            return `${comment.length} comments`;

        }
        else{
          return ` comment`;
        }
        
      },
      checkstate: function (followers, loggedUser) {

        for(let i = 0; i<followers.length;i++){
          if (followers[i]._id.toString()==loggedUser._id.toString()) { 
            return ` <input type="submit"  class="btn mid-text right" style="color: white !important;" value="Following"/>
            `;
          }
       
        }
        return ` <input type="submit"  class="btn blue mid-text right" style="color: white !important;" value="Follow"/>
            `;
        
      },
      checkLikedState: function (likes, loggedUser) {

        for(let i = 0; i<likes.length;i++){
          if (likes[i]._id.toString() == loggedUser._id.toString()) { 
            return `<input type="submit" class="btn-small material-icons round blue" value="thumb_up"> Unlike 
            `;
          }
       
        }
        return `<input type="submit" class="btn-small material-icons round htp" value="thumb_up"/> Like
        `;
        
        
      },
      checkLikedStateforsingle: function (likes, loggedUser) {
        for(let i = 0; i<likes.length;i++){
          if (likes[i]._id.toString() == loggedUser._id.toString()) { 
            return `<input type="submit" class="btn-small material-icons round-1 blue" value="thumb_up"> Unlike 
            `;
          }
       
        }
        return `<input type="submit" class="btn-small material-icons round-1 htp" value="thumb_up"/> Like
        `;
      },
      checkRequeststate: function (requests, loggedUser, NextUser, LoggedUserRequests) {
        if(requests){
          for(let i = 0; i<requests.length;i++){
            if (requests[i]._id.toString()==loggedUser._id.toString()) { 
              return ` 
              <form action="/feed/user/${NextUser}/request" method="POST" class="right" >
                  <input type="hidden" name="_method" value="PUT">
                  <input type="submit"  class="btn mid-text right" style="color: white !important;" value="Requested"/>
              </form>
              
              `;
            }
          }
        }
        

        for(let i = 0; i<loggedUser.friends.length; i++) {
          if(NextUser.toString() == loggedUser.friends[i]._id.toString()) {
            return `
            <form action="/feed/user/${NextUser}/accept" method="POST" class="right" >
                <input type="hidden" name="_method" value="PUT">
                <input type="submit"  class="btn mid-text right" style="color: white !important;" value="Unfriend"/>
            </form>
            `;
          }
        }

        for(let i = 0; i<loggedUser.requests.length; i++) {
          if(NextUser.toString() == loggedUser.requests[i]._id.toString()) {
            return `
            <form action="/feed/user/${NextUser}/accept" method="POST" class="right" >
                <input type="hidden" name="_method" value="PUT">
                <input type="submit"  class="btn mid-text right" style="color: white !important;" value="Accept Request"/>
            </form>
            `;
          }
          
        }

        


        return ` 
        <form action="/feed/user/${NextUser}/request" method="POST" class="right" >
            <input type="hidden" name="_method" value="PUT">
            <input type="submit"  class="btn blue mid-text right" style="color: white !important;" value="Add Friend"/>
        </form>
        `;
        
      },
      sendRequest: function (requests, loggedUser, NextUser, LoggedUserRequests) {
        if(loggedUser._id.toString() != NextUser.toString()) {


          if(requests){
            for(let i = 0; i<requests.length;i++){
              if (requests[i]._id.toString()==loggedUser._id.toString()) { 
                return ` 
                <form action="/feed/user/${NextUser}/request" method="POST">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="submit"  class="chip res btn mid-text" title ="Cancel Request" style="color: white !important;" value="Requested"/>
                </form>
                `;
              }
            }
          }

          for(let i = 0; i<loggedUser.friends.length; i++) {
            if(NextUser.toString() == loggedUser.friends[i]._id.toString()) {
              return `
              <form action="/feed/user/${NextUser}/accept" method="POST"  >
                  <input type="hidden" name="_method" value="PUT">
                  <input type="submit"  class="chip res btn mid-text" style="color: white !important;" value="Unfriend"/>
              </form>
              `;
            }
          }

          for(let i = 0; i<loggedUser.requests.length; i++) {
            if(NextUser.toString() == loggedUser.requests[i]._id.toString()) {
              return `
              <form action="/feed/user/${NextUser}/accept" method="POST"  >
                  <input type="hidden" name="_method" value="PUT">
                  <input type="submit"  class="chip res btn mid-text" style="color: white !important;" value="Accept Request"/>
              </form>
              `;
            }
            
          }

          return `
          <form action="/feed/user/${NextUser}/request" method="POST">
              <input type="hidden" name="_method" value="PUT">
              <input type="submit"  class="chip res btn mid-text" style="color: white !important;" value="Add Friend"/>
          </form>
          `;

      }
      else{
        return ``;
      }

      },

      checkFriendsList: function (requests, loggedUser, NextUser, LoggedUserRequests) {
        if(requests){
          for(let i = 0; i<requests.length;i++){
            if (requests[i]._id.toString()==loggedUser._id.toString()) { 
              return ` 
              <form action="/feed/user/${NextUser}/request" method="POST">
                  <input type="hidden" name="_method" value="PUT">
                  <input type="submit"  class="chip res btn mid-text" 
                      style="
                          color: white !important; 
                          margin-right:0 !important;
                          margin-left:0 !important"
                            value="Requested"/>
              </form>
              
              `;
            }
          }
        }
        
        
        if(NextUser.toString() == loggedUser._id.toString()) {
          return ``;
        }
        

        for(let i = 0; i<loggedUser.friends.length; i++) {
          if(NextUser.toString() == loggedUser.friends[i]._id.toString()) {
            return `
            <form action="/feed/user/${NextUser}/accept" method="POST">
                <input type="hidden" name="_method" value="PUT">
                <input type="submit"  class="chip res btn mid-text" 
                    style="
                        color: white !important; 
                        margin-right:0 !important;
                        margin-left:0 !important"
                          value="Unfriend"/>
            </form>
            `;
          }
        }

        for(let i = 0; i<loggedUser.requests.length; i++) {
          if(NextUser.toString() == loggedUser.requests[i]._id.toString()) {
            return `
            <form action="/feed/user/${NextUser}/accept" method="POST">
                <input type="hidden" name="_method" value="PUT">
                <input type="submit"  class="chip res btn mid-text" 
                    style="
                        color: white !important; 
                        margin-right:0 !important;
                        margin-left:0 !important"
                          value="Accept Request"/>
            </form>
            `;
          }
          
        }

        


        return ` 
        <form action="/feed/user/${NextUser}/request" method="POST">
            <input type="hidden" name="_method" value="PUT">
            <input type="submit"  class="chip res btn mid-text" 
                style="
                    color: white !important; 
                    margin-right:0 !important;
                    margin-left:0 !important"
                      value="Add Friend"/>
        </form>
        `;
        
      },
      showMessageIcon: function (loggedUser, NextUser) {
        if(loggedUser._id.toString() == NextUser.toString()) {
          return ``;
        }
        else{
          return `
            <form action="/messages/${NextUser}" method="POST">
            <input type="hidden" name="_method" value="PUT">
            <input type="submit"  class="chip res btn mid-text material-icons" style="color: white !important;" value="message"/>
            </form>`;

        }
      },

      notify_Badge: function(notification) {
        let count = 0
        if(notification) {
          for(let i = 0; i<notification.length; i++) {
            if(notification[i].status == "unread" ) {
              count = count + 1
            }
          }
          if(count == 0) {
            return ``;
          }
          else{
            return `<span class="badge_notify"> ${count} </span>`;

          }
        }
        else{
          return ``;
        }
      },

      notify_Badge_friends: function(requests) {
        if(requests.length != 0) {

            return `<span class="badge_notify_friends"> ${requests.length} </span>`;
  
        }
            else{
              return ``;
            }
        
      
        
        
        
      },

      
      UnreadNotify: function(status) {
       
            if(status == "unread") {
             
              return `unread`;
            }
            else {
              
              return `read`;
            }
        
      },

      getNotificationMethod:function(notification) {
        if(notification == "like")
          return `<span class="badge_notify_post">
          <img src="/img/like.png" alt="" 
          style="
          height:20px; 
          width:20px; 
          " >
      </span>`;
        else if(notification == "comment")
          return `<span class="badge_notify_post">
          <img src="/img/comment.png" alt="" 
          style="
          height:20px; 
          width:20px; 
          " >
      </span>`;
        else if(notification == "friend")
          return `<span class="badge_notify_post">
          <img src="/img/person.png" alt="" 
          style="
          height:20px; 
          width:20px; 
          " >
      </span>`;
        else
          return ``;
      },

      showBirthdays: function(firstName, lastName, image, dob) {
       
        const today = new Date(Date.now())
        const birthday = new Date(dob)
        if(birthday.getDate() == today.getDate()
          && birthday.getMonth() == today.getMonth()) {
            return `${firstName}`;
          }
        
      },



    


}