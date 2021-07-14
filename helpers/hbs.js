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

      editIcon: function (storyUser, loggedUser, storyId,) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
           
          return `<!-- Dropdown Trigger -->
          <a class='dropdown-trigger btn right' href='#' data-target='post-edit'><i class="material-icons">more_horiz</i></a>

          <!-- Dropdown Structure -->
          <div id='post-edit' class='dropdown-content show'>
              
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
            <a class='dropdown-trigger btn right' href='#' data-target='post-edit'><i class="material-icons">more_horiz</i></a>

            <!-- Dropdown Structure -->
            <div id='post-edit' class='dropdown-content show'>
                
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
              return `<img src="/uploads/posts/${image_name}" alt="" height="400px" width="100%" />
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
            return `<img src="/uploads/stories/${image_name}" alt="" height="100px" width="100px" class="card timestories" style={float:left} />
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
            return `<input type="submit" class="btn-small blue material-icons round" value="thumb_up"/> Unlike
            `;
          }
       
        }
        return `<input type="submit" class="btn-small htp material-icons round" value="thumb_up"/> Like
        `;
        
        
      },
      checkLikedStateforsingle: function (likes, loggedUser) {
        for(let i = 0; i<likes.length;i++){
          if (likes[i]._id.toString() == loggedUser._id.toString()) { 
            return `<input type="submit" class="btn-small blue material-icons round-1 " value="thumb_up"/> Unlike
            `;
          }
       
        }
        return `<input type="submit" class="btn-small htp material-icons" value="thumb_up"/> Like
        `;
      },
      checkRequeststate: function (requests, loggedUser, NextUser, LoggedUserRequests) {

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

        // for(let i = 0; i<loggedUser.friends.length; i++) {
        //   if(NextUser.toString() == loggedUser.friends[i]._id.toString()) {
        //     return `
        //     <form action="/feed/user/${NextUser}/accept" method="POST" class="right" >
        //         <input type="hidden" name="_method" value="PUT">
        //         <input type="submit"  class="btn mid-text right" style="color: white !important;" value="Friends"/>
        //     </form>
        //     `;
        //   }
        // }

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


    


}