<section class="create">

  <aside>
    <h2>Add new group</h2>
    <ul>
      <li><a href="#">Untitled</a></li>
    </ul>

    <p><a href="index.php?page=groups">Cancel</a></p>
  </aside>

  <section class="createflow">

    <h1>Add new group</h1>

    <form method="post" action="index.php?page=add">
      <div>
        <label for="groupname">Groupname:</label>
          <input type="text" placeholder="Untitled" name="groupname" value="<?php if(!empty($_POST['groupname'])) echo $_POST['groupname'] ;?>">
          <span>
             <?php if(!empty($errors['groupname'])){
              echo $errors['groupname'];
              };?>
          </span>
      </div>

      <div>
        <label for="description">Description:</label>
        <textarea name="description" class="description"><?php if(!empty($_POST['description'])) echo $_POST['description'] ;?></textarea>
          <span>
             <?php if(!empty($errors['description'])){
              echo $errors['description'];
              };?>
          </span>
      </div>

      <div>
        <label for="invite">Send invites:</label>
        <input type="text" name="invite" value="<?php if(!empty($_POST['invite'])) echo $_POST['invite'] ;?>"/>
          <span>
             <?php if(!empty($errors['invite'])){
              echo $errors['invite'];
              };?>
          </span>
      </div>

      <div>
        <input type="submit" value="Save group"/>
      </div>
    </form>

  </section>

</section>