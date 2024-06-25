
{
    'name': 'Advance Bulk & Quick Search',
    'version': '1.2',
    'summary': 'Advance Quick Bulk Search Records',
    'description': 'The Advance Bulk, Quick Search module is designed to enhance the search functionality with features such as separate search, bulk search, quick bulk related search, allowing users to efficiently find relevant records across various models.',
    'sequence': 10,
    'author': "JD DEVS",
    'depends': ['base', 'base_setup'],
    'data': [
        'views/search_record.xml',
        'security/ir.model.access.csv'
    ],
    'assets': {
        'web.assets_backend': [
            'bulk_search/static/src/css/style.css',

            'bulk_search/static/src/js/search_icon.js',

            'bulk_search/static/src/xml/search_icon.xml'
        ],
    },
    'images': ['static/description/assets/screenshots/banner.jpg'],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
