module.exports = {
  prompt: ({ inquirer, _args }) => {
    const questions = [
      {
        type: 'input',
        name: 'dir',
        message: 'Where is tha directory? ex: src/components/elements',
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of component? ex: Button',
      },
      {
        type: 'confirm',
        name: 'have_props',
        message: 'Is it have props?',
        choices: ['Yes', 'No'],
        initial: 'Yes',
      },
    ];
    return inquirer.prompt(questions).then((answers) => {
      const { dir, name, have_props } = answers;
      const { join } = require('node:path');

      const path = join(`${dir || 'src/'}`, '/', name);
      const type_annotate = have_props ? `FC<${name}Props>` : 'FC';
      const props = have_props ? '(props)' : '()';
      return { ...answers, path, type_annotate, props };
    });
  },
};
