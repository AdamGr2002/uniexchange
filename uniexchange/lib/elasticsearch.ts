/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '@elastic/elasticsearch'

const client = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'
})

interface Material {
    id: number;
    title: string;
    description: string;
    university: string;
    subject: string;
    year: number;
    user_id: number;
    created_at:Date;
}

export async function indexMaterial(material: Material): Promise<void> {
    await client.index({
        index: 'materials',
        id: material.id.toString(),
        body: {
            title: material.title,
            description: material.description,
            university: material.university,
            subject: material.subject,
            year: material.year,
            user_id: material.user_id,
            created_at: material.created_at
        }
    })
}

interface SearchFilters {
    [key: string]: string | number | boolean;
}

interface SearchResult {
    id: string;
    title: string;
    description: string;
    university: string;
    subject: string;
    year: number;
    user_id: number;
    created_at: string;
}

export async function searchMaterials(query: string, filters: SearchFilters = {}): Promise<SearchResult[]> {
    const should = [
        { match: { title: { query, boost: 2 } } },
        { match: { description: query } },
        { match: { university: query } },
        { match: { subject: query } }
    ];

    const must = Object.entries(filters).map(([key, value]) => ({
        term: { [key]: value }
    }));

    const result = await client.search({
        index: 'materials',
        body: {
            query: {
                bool: {
                    should,
                    must
                }
            }
        }
    });

    return result.hits.hits.map(hit => ({
        id: hit._id,
        ...hit._source as any
    })) as SearchResult[];
}