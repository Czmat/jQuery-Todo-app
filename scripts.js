$(function () {
  const todos = [
    {
      task: 'make todo app',
      isComplete: false,
    },
    {
      task: 'take a nap',
      isComplete: true,
    },
  ];

  const app = {
    showTodos: function () {
      const todosListEl = $('#todos-list');

      todosListEl.html('');

      todos.forEach(function (todo) {
        const taskClass = 'todo-task' + (todo.isComplete ? ' is-complete' : '');

        todosListEl.append(
          '\
        <tr>\
        <td class="' +
            taskClass +
            '">' +
            todo.task +
            '</td>\
            <td>\
              <button class="edit-button">Edit</button>\
              <button class="delete-button">Delete</button>\
              <button class="save-button">Save</button>\
              <button class="cancel-button">Cancel</button>\
            </td>\
        </tr>\
        '
        );
      });
    },

    addTodo: function (event) {
      event.preventDefault();

      const createInput = $('#create-input');
      const createInputValue = createInput.val();
      let errorMessage = null;

      if (!createInputValue) {
        errorMessage = 'Task cannot be empty.';
      } else {
        todos.forEach(function (todo) {
          if (todo.task === createInputValue) {
            errorMessage = 'Task already exists.';
          }
        });
      }

      if (errorMessage) {
        app.showErrorMessage(errorMessage);
        return;
      }

      todos.push({
        task: createInputValue,
        isComplete: false,
      });
      createInput.val('');
      app.showTodos();
    },

    toggleTodo: function () {
      todos.forEach(
        function (todo) {
          if (todo.task === $(event.target).text()) {
            todo.isComplete = !todo.isComplete;
          }
        }.bind(this)
      );
      app.showTodos();
    },

    enterEditMode: function () {
      const actionCell = $(this).closest('td');
      const taskCell = actionCell.prev();

      actionCell.find('.save-button').show();
      actionCell.find('.cancel-button').show();
      actionCell.find('.edit-button').hide();
      actionCell.find('.delete-button').hide();

      taskCell.removeClass('todo-task');
      app.currentTask = taskCell.text();
      taskCell.html(
        '<input type="text" class="edit-input" value="' +
          app.currentTask +
          '" />'
      );
    },

    exitEditMode: function () {
      const actionCell = $(this).closest('td');
      const taskCell = actionCell.prev();

      actionCell.find('.save-button').hide();
      actionCell.find('.cancel-button').hide();
      actionCell.find('.edit-button').show();
      actionCell.find('.delete-button').show();

      taskCell.addClass('todo-task');
      taskCell.html(app.currentTask);
    },

    saveTask: function () {
      const newTask = $('.edit-input').val();

      todos.forEach(function (todo) {
        if (app.currentTask === todo.task) {
          todo.task = newTask;
        }
      });
      app.currentTask = newTask;
      app.exitEditMode.call(this);
    },

    deleteTask: function () {
      const taskToDelete = $(this).parent('td').prev().text();
      let found = false;

      todos.forEach(function (todo, index) {
        if (!found && taskToDelete === todo.task) {
          todos.splice(index, 1);
          found = true;
        }
      });
      app.showTodos();
    },

    showErrorMessage: function (errorMessage) {
      $('.error-message').html(errorMessage).slideDown();
    },

    clearErrorMessage: function () {
      $('.error-message').fadeOut();
    },
  };

  $('#create-form button').css('background', 'green');
  $('#create-form button').css({
    color: 'white',
    borderRadius: '6px',
  });

  app.showTodos();

  $('#create-form').on('submit', app.addTodo);
  $('#create-input').on('keyup', app.clearErrorMessage);
  $('table').on('click', '.todo-task', app.toggleTodo);
  $('table').on('click', '.edit-button', app.enterEditMode);
  $('table').on('click', '.cancel-button', app.exitEditMode);
  $('table').on('click', '.save-button', app.saveTask);
  $('table').on('click', '.delete-button', app.deleteTask);
});
